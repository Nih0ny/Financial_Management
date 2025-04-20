import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import { ReceiptManualDto } from './dto/receipt-manual.dto';
import { UserService } from 'src/user/user.service';
import { ReceiptService } from 'src/receipt/receipt.service';
import { CategoryService } from 'src/category/category.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfirmReceipParsingDto } from './dto/confirm-receipt-parsing.dto';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ReceiptInterface } from './interfaces/receipt.interface';

@Injectable()
export class UploadDataService {
  constructor(
    private readonly userService: UserService,
    private readonly receiptService: ReceiptService,
    private readonly categoryService: CategoryService,
    private readonly openAiService: OpenAiService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async acceptReceiptImage(base64File: string, email: string) {
    await this.cacheManager.set(email + 'receipt', base64File);
    return (
      (await this.openAiService.parseReceiptFromImage(base64File)) as {
        receipt: { photoPath: string };
      }
    ).receipt;
  }

  async confirmReceipParsing(receipt: ConfirmReceipParsingDto, email: string) {
    const base64ReceiptImage: string | null =
      await this.cacheManager.get<string>(email + 'receipt');

    if (!base64ReceiptImage)
      throw new NotFoundException('Not found receipt image');

    const filePath = path.join('receipts', email, uuidv4());
    const dirPath = path.dirname(filePath);

    await fs.access(dirPath).catch(async () => {
      await fs.mkdir(dirPath, { recursive: true });
    });

    await fs.writeFile(filePath, base64ReceiptImage);
    await this.createManualReceipt({ ...receipt, photoPath: filePath }, email);
    await this.cacheManager.del(email + 'receipt');
  }

  async createManualReceipt(receipt: ReceiptInterface, userEmail: string) {
    const user = await this.userService.findOneByEmail(userEmail);
    if (!user) throw new NotFoundException('User not found');

    const category = await this.categoryService.findOneByName(
      receipt.category.name,
    );
    if (!category) throw new NotFoundException('Category not found');

    if (!this.receiptService.checkTotal(receipt.items, receipt.total))
      throw new BadRequestException(
        'Total in receipt is not watch with real total',
      );

    await this.receiptService.create({
      ...receipt,
      category: category,
      user: user,
    });
  }
}

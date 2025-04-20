import { Injectable, NotFoundException } from '@nestjs/common';
import { ReceiptService } from 'src/receipt/receipt.service';
import { UserReceiptsDto } from './dto/user-receipts.dto';
import { Receipt } from 'src/entities/receipt.entity';
import { ReceiptManualDto } from 'src/upload-data/dto/receipt-manual.dto';
import { ReceiptFilterDto } from 'src/receipt/dto/receipt-filter.dto';

@Injectable()
export class GetDataService {
  constructor(private readonly receiptService: ReceiptService) {}

  async findAllByUser(userId: number) {
    const receipts = await this.receiptService.findAllByUser(userId);

    const castedReceipts: UserReceiptsDto[] = receipts.map((val) => {
      return this.castReceipt(val);
    });

    return castedReceipts;
  }

  async searchReceipts(filter: ReceiptFilterDto) {
    return await this.receiptService.getFilteredReceipts(filter);
  }

  castReceipt(receipt: Receipt): UserReceiptsDto {
    const { user, photoPath, ...rest } = receipt;

    const castedReceipts: UserReceiptsDto = {
      ...rest,
      ...(photoPath ? { photoPath } : {}),
    };

    return castedReceipts;
  }

  checkImage(receipt: Receipt): boolean {
    return receipt.photoPath ? true : false;
  }
}

import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
  Request,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { GetDataService } from './get-data.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReceiptGuard } from 'src/receipt/receipt.guard';
import { Receipt } from 'src/entities/receipt.entity';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { CacheManagerStore } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { createReadStream } from 'fs';
import { basename, join } from 'path';
import { ReceiptFilterDto } from 'src/receipt/dto/receipt-filter.dto';

@Controller('get-data')
@UseGuards(AuthGuard)
export class GetDataController {
  constructor(private readonly getDataService: GetDataService) {}

  @Get('/all')
  async findAllByUser(
    @Param('id') userId: number,
    @Request() req: { user: { id: number } },
  ) {
    return await this.getDataService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(ReceiptGuard)
  findOneById(
    @Param('id') id: string,
    @Request() req: { user: { id: number }; receipt: Receipt },
  ) {
    return this.getDataService.castReceipt(req.receipt);
  }

  @Get('photo/:id')
  @UseGuards(ReceiptGuard)
  getReceiptPhoto(
    @Param('id') id: string,
    @Request() req: { user: { id: number }; receipt: Receipt },
  ) {
    if (!this.getDataService.checkImage(req.receipt))
      throw new BadRequestException('Receipt without photo');
    return new StreamableFile(createReadStream(join(req.receipt.photoPath)), {
      type: `image/jpeg`,
      disposition: `inline; filename="${basename(req.receipt.photoPath)}"`,
    });
  }

  @Get()
  async getFilteredReceipts(
    @Request() req: { user: { id: number } },
    @Query() query: ReceiptFilterDto,
  ) {
    return this.getDataService.searchReceipts(query, req.user.id);
  }
}

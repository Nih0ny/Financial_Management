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
    @Query('merchants') merchants?: string,
    @Query('categories') categories?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('paymentTypes') paymentTypes?: string,
    @Query('totalFrom') totalFrom?: string,
    @Query('totalTo') totalTo?: string,
  ) {
    return this.getDataService.searchReceipts({
      userId: req.user.id,
      merchants,
      categories,
      startDate,
      endDate,
      paymentTypes,
      totalFrom,
      totalTo,
    });
  }
}

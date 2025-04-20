import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceiptItems } from 'src/entities/receipt-items.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReceiptItemsService {
  constructor(
    @InjectRepository(ReceiptItems)
    private readonly receiptItemsRepository: Repository<ReceiptItems>,
  ) {}

  async deleteAll(items: ReceiptItems[]) {
    await this.receiptItemsRepository.remove(items);
  }
}

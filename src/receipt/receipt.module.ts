import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from 'src/entities/receipt.entity';
import { ReceiptItemsModule } from 'src/receipt-items/receipt-items.module';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt]), ReceiptItemsModule],
  controllers: [ReceiptController],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule {}

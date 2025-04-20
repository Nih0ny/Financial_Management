import { Module } from '@nestjs/common';
import { ReceiptItemsService } from './receipt-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptItems } from 'src/entities/receipt-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReceiptItems])],
  providers: [ReceiptItemsService],
  exports: [ReceiptItemsService],
})
export class ReceiptItemsModule {}

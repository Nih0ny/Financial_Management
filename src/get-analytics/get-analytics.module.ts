import { Module } from '@nestjs/common';
import { GetAnalyticsService } from './get-analytics.service';
import { GetAnalyticsController } from './get-analytics.controller';
import { ReceiptModule } from 'src/receipt/receipt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from 'src/entities/receipt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt]), ReceiptModule],
  controllers: [GetAnalyticsController],
  providers: [GetAnalyticsService],
})
export class GetAnalyticsModule {}

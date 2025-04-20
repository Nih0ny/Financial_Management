import { Module } from '@nestjs/common';
import { GetDataService } from './get-data.service';
import { GetDataController } from './get-data.controller';
import { ReceiptModule } from 'src/receipt/receipt.module';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ReceiptModule],
  controllers: [GetDataController],
  providers: [GetDataService],
})
export class GetDataModule {}

import { Module } from '@nestjs/common';
import { UploadDataService } from './upload-data.service';
import { UploadDataController } from './upload-data.controller';
import { ReceiptModule } from 'src/receipt/receipt.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { UserModule } from 'src/user/user.module';
import { CategoryModule } from 'src/category/category.module';
import { CacheModule } from '@nestjs/cache-manager';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  imports: [
    ReceiptModule,
    UserModule,
    CategoryModule,
    OpenAiModule,
    CacheModule.register(),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [UploadDataController],
  providers: [UploadDataService],
})
export class UploadDataModule {}

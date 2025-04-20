import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Receipt } from './entities/receipt.entity';
import { Category } from './entities/category.entity';
import { ReceiptItems } from './entities/receipt-items.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { ReceiptModule } from './receipt/receipt.module';
import { UploadDataModule } from './upload-data/upload-data.module';
import { OpenAiService } from './open-ai/open-ai.service';
import { OpenAiModule } from './open-ai/open-ai.module';
import { GetDataModule } from './get-data/get-data.module';
import { GetAnalyticsModule } from './get-analytics/get-analytics.module';
import { CategoryModule } from './category/category.module';
import { ReceiptItemsService } from './receipt-items/receipt-items.service';
import { ReceiptItemsModule } from './receipt-items/receipt-items.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Receipt, Category, ReceiptItems],
      synchronize: true,
    }),
    MailModule,
    ReceiptModule,
    UploadDataModule,
    OpenAiModule,
    GetDataModule,
    GetAnalyticsModule,
    CategoryModule,
    ReceiptItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService, OpenAiService],
})
export class AppModule {}

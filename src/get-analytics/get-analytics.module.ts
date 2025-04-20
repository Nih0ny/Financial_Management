import { Module } from '@nestjs/common';
import { GetAnalyticsService } from './get-analytics.service';
import { GetAnalyticsController } from './get-analytics.controller';

@Module({
  controllers: [GetAnalyticsController],
  providers: [GetAnalyticsService],
})
export class GetAnalyticsModule {}

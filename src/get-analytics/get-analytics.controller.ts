import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { GetAnalyticsService } from './get-analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Receipt } from 'src/entities/receipt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('get-analytics')
@UseGuards(AuthGuard)
export class GetAnalyticsController {
  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    private readonly getAnalyticsService: GetAnalyticsService,
  ) {}

  @Get()
  async getAnalyticsReq(@Query() query: AnalyticsQueryDto) {
    return this.getAnalyticsService.getAnalytics(query);
  }
}

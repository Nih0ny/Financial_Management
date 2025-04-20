import { Controller } from '@nestjs/common';
import { GetAnalyticsService } from './get-analytics.service';

@Controller('get-analytics')
export class GetAnalyticsController {
  constructor(private readonly getAnalyticsService: GetAnalyticsService) {}
}

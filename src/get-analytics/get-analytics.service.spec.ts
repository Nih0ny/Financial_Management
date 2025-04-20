import { Test, TestingModule } from '@nestjs/testing';
import { GetAnalyticsService } from './get-analytics.service';

describe('GetAnalyticsService', () => {
  let service: GetAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetAnalyticsService],
    }).compile();

    service = module.get<GetAnalyticsService>(GetAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

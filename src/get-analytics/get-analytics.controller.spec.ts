import { Test, TestingModule } from '@nestjs/testing';
import { GetAnalyticsController } from './get-analytics.controller';
import { GetAnalyticsService } from './get-analytics.service';

describe('GetAnalyticsController', () => {
  let controller: GetAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAnalyticsController],
      providers: [GetAnalyticsService],
    }).compile();

    controller = module.get<GetAnalyticsController>(GetAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

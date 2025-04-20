import { Test, TestingModule } from '@nestjs/testing';
import { GetDataController } from './get-data.controller';
import { GetDataService } from './get-data.service';

describe('GetDataController', () => {
  let controller: GetDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetDataController],
      providers: [GetDataService],
    }).compile();

    controller = module.get<GetDataController>(GetDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

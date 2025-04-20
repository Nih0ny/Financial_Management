import { Test, TestingModule } from '@nestjs/testing';
import { UploadDataController } from './upload-data.controller';
import { UploadDataService } from './upload-data.service';

describe('UploadDataController', () => {
  let controller: UploadDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadDataController],
      providers: [UploadDataService],
    }).compile();

    controller = module.get<UploadDataController>(UploadDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

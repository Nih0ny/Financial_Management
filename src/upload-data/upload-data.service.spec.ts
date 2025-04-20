import { Test, TestingModule } from '@nestjs/testing';
import { UploadDataService } from './upload-data.service';

describe('UploadDataService', () => {
  let service: UploadDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadDataService],
    }).compile();

    service = module.get<UploadDataService>(UploadDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

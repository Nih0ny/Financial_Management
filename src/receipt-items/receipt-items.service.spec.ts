import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptItemsService } from './receipt-items.service';

describe('ReceiptItemsService', () => {
  let service: ReceiptItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptItemsService],
    }).compile();

    service = module.get<ReceiptItemsService>(ReceiptItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

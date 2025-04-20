import { CategoryDto } from 'src/category/dto/category.dto';
import { ReceiptItemDto } from '../dto/receipt-item.dto';
import { PaymentType } from 'src/entities/receipt.entity';

export interface ReceiptInterface {
  category: CategoryDto;

  photoPath?: string;

  merchant: string;

  total: number;

  items: ReceiptItemDto[];

  paymentType: PaymentType;

  date: Date;
}

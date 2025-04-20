import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ReceiptItemDto } from './receipt-item.dto';
import { Type } from 'class-transformer';
import { PaymentType } from 'src/entities/receipt.entity';
import { Category } from 'src/entities/category.entity';
import { CategoryDto } from 'src/category/dto/category.dto';

export class ReceiptManualDto {
  @IsNotEmpty()
  category: CategoryDto;

  @IsString()
  @IsNotEmpty()
  merchant: string;

  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 })
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiptItemDto)
  items: ReceiptItemDto[];

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;
}

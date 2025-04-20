import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Category } from 'src/entities/category.entity';
import { PaymentType } from 'src/entities/receipt.entity';
import { ReceiptItemDto } from 'src/upload-data/dto/receipt-item.dto';

export class UserReceiptsDto {
  @IsOptional()
  photoPath?: string;

  @IsString()
  @IsNotEmpty()
  category: Category;

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

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;
}

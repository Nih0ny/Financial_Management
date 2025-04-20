import { IsInt, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class ReceiptItemDto {
  @IsString()
  @MinLength(1)
  product: string;

  @IsNumber()
  @Min(0)
  @IsInt()
  amount: number;

  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;
}

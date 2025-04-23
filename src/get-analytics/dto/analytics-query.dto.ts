import { IsOptional, IsString } from 'class-validator';

export class AnalyticsQueryDto {
  @IsOptional()
  @IsString()
  merchants?: string;

  @IsOptional()
  @IsString()
  categories?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  dateFormat?: string;

  @IsOptional()
  @IsString()
  paymentTypes?: string;

  @IsOptional()
  @IsString()
  totalFrom?: string;

  @IsOptional()
  @IsString()
  totalTo?: string;

  @IsOptional()
  @IsString()
  groupOrder?: string;
}

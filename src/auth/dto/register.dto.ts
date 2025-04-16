import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { SendCodeDto } from './send-code.dto';

export class RegisterDto extends SendCodeDto {
  @MaxLength(40)
  @IsNotEmpty()
  name: string;

  @MinLength(8)
  password: string;

  @IsOptional()
  avatar: string;
}

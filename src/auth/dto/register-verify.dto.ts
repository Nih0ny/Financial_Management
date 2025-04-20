import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterVerifyDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  activationCode: string;
}

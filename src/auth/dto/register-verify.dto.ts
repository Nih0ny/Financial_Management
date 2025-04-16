import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterVerifyDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  activationCode: string;
}

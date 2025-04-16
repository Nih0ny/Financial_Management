import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;

  @MinLength(8)
  newPassword: string;

  @MinLength(8)
  repeatNewPassword: string;
}

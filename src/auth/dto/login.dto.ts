import { IsEmail, MinLength } from 'class-validator';

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

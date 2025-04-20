import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

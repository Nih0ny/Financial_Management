import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface SignUp {
  name: string;
  email: string;
  password: string;
}

interface SignUpVerify {
  code: string;
}

interface LogIn {
  nameOrEmail: string;
  password: string;
}

interface ResetPasswordSendCode {
  name: string;
  email: string;
  password: string;
}

interface ResetPassword {
  code: string;
  newPassword: string;
  repeatNewPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  SignUp(@Body() body: SignUp): string {
    console.log(JSON.stringify(body));
    throw new NotFoundException('haha, looser');
    return '12';
  }

  @Post('signup/verify')
  SignUpVerify(@Body() body: SignUp): string {
    console.log(JSON.stringify(JSON.stringify(body)));
    return '12';
  }

  @Post('login')
  LogIn(@Body() body: SignUp): string {
    console.log(JSON.stringify(JSON.stringify(body)));
    return '12';
  }

  @Post('reset-pass/send-code')
  ForgotPassword(@Body() body: SignUp): string {
    console.log(JSON.stringify(JSON.stringify(body)));
    return '12';
  }

  @Post('reset-pass')
  ForgotPasswordVerify(@Body() body: SignUp): string {
    console.log(JSON.stringify(JSON.stringify(body)));
    return '12';
  }
}

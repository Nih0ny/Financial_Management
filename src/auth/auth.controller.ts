import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';

import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterVerifyDto } from './dto/register-verify.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendCodeDto } from './dto/send-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar', { dest: './avatars' }))
  async Register(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 10240 }),
          new FileTypeValidator({ fileType: /^image/ }),
        ],
      }),
    )
    avatar: Express.Multer.File,
    @Body() body: RegisterDto,
  ) {
    body.avatar = avatar
      ? path.join('avatars', avatar.filename)
      : 'avatars/default';

    await this.authService.register(body);
  }

  @Post('register/verify')
  async RegisterVerify(@Body() body: RegisterVerifyDto) {
    await this.authService.registerVerify(body.email, body.activationCode);
  }

  @Post('login')
  async Login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(body.email, body.password);
  }

  @Post('refresh-token')
  async RefreshTokens(
    @Body() body: { refreshToken: string },
  ): Promise<LoginResponseDto> {
    return await this.authService.refreshTokens(body.refreshToken);
  }

  @Post('reset-password/send-code')
  async SendResetPasswordCode(@Body() body: SendCodeDto) {
    await this.authService.sendResetPasswordCode(body.email);
  }

  @Patch('reset-password')
  async ResetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body);
  }
}

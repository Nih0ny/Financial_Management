import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs/promises';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserVerify } from './interfaces/user-verify.interface';
import { LoginResponseDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenPayload } from './interfaces/token-payload.interface';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(user: RegisterDto) {
    if ((await this.userService.findOneByEmail(user.email)) != null)
      throw new ConflictException('User with this email already exist');

    const activationCode = await this.generateCode();
    user.password = await bcrypt.hash(user.password, 10);

    await this.cacheManager.set(
      user.email,
      { ...user, activationCode },
      900000,
    );

    await this.mailService.sendMessage(user.email, {
      subject: 'Verify your account',
      text: 'Use this code to verify your account:',
      html: `<p>Verify Your Email; Your code: ${activationCode}</p>`,
    });
  }

  async registerVerify(email: string, code: string) {
    const user: UserVerify | null =
      await this.cacheManager.get<UserVerify>(email);

    if (!user) throw new NotFoundException('Not found email for verify');

    if (!(user.activationCode == code))
      throw new BadRequestException('Codes not match');
    await this.cacheManager.del(email);

    const avatarPath =
      user.avatar == 'default'
        ? path.join('avatars', 'default')
        : path.join('avatars', user.email, 'avatar');

    if (!(user.avatar == 'default')) {
      user.avatar = path.join('avatars', user.email, 'avatar');
      await fs.mkdir(path.dirname(avatarPath), { recursive: true });
      await fs.writeFile(avatarPath, user.avatar);
    }
    await this.userService.create({ ...user, avatar: avatarPath });
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userService.findOneByEmail(email);
    if (user == null)
      throw new NotFoundException('User with this email already exist');

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Passwords not match');

    const payload = { id: user.id, email: user.email, name: user.name };

    return await this.getTokens(payload);
  }

  async refreshTokens(refreshToken: string): Promise<LoginResponseDto> {
    const payload: TokenPayload = await this.jwtService.verifyAsync(
      refreshToken,
      {
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );
    if (!payload) throw new UnauthorizedException();

    const cache: string | null = await this.cacheManager.get(
      payload.email + ' ' + 'refresh',
    );
    if (!cache) throw new UnauthorizedException();

    return await this.getTokens(payload);
  }

  private async getTokens(payload: TokenPayload): Promise<LoginResponseDto> {
    const tokens: LoginResponseDto = {
      accessToken: await this.jwtService.signAsync({
        id: payload.id,
        email: payload.email,
        name: payload.name,
      }),
      refreshToken: await this.jwtService.signAsync(
        {
          id: payload.id,
          email: payload.email,
          name: payload.name,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    };
    await this.cacheManager.set(
      payload.email + ' ' + 'refresh',
      tokens.refreshToken,
      1000 * 60 * 60 * 24 * 7,
    );
    return tokens;
  }

  async sendResetPasswordCode(email: string) {
    if ((await this.userService.findOneByEmail(email)) == null)
      throw new NotFoundException('User with this email not exist');

    const resetPasswordCode = await this.generateCode();

    await this.cacheManager.set(email, resetPasswordCode, 900000);

    await this.mailService.sendMessage(email, {
      subject: 'Reset password',
      text: 'Use this code to reset password of your account:',
      html: `<p>Reset password code: ${resetPasswordCode}</p>`,
    });
  }

  private async generateCode(): Promise<string> {
    return (await bcrypt.hash(Math.random().toString(16).substring(2, 16), 10))
      .replaceAll(/[^a-zA-Z0-9$]/g, '')
      .split('$')[3];
  }

  async resetPassword(resetPasswordInfo: ResetPasswordDto) {
    const user = await this.userService.findOneByEmail(resetPasswordInfo.email);
    if (user == null)
      throw new NotFoundException('User with this email not exist');

    const resetPasswordCode: string | null =
      await this.cacheManager.get<string>(resetPasswordInfo.email);

    if (!resetPasswordCode)
      throw new NotFoundException('Not found code for reset password');

    if (await bcrypt.compare(resetPasswordInfo.newPassword, user.password))
      throw new BadRequestException(
        'The new password must be different from the old one.',
      );

    if (resetPasswordInfo.newPassword != resetPasswordInfo.repeatNewPassword)
      throw new BadRequestException('Passwords not match');

    if (!(resetPasswordCode == resetPasswordInfo.code))
      throw new BadRequestException('Codes not match');

    await this.cacheManager.del(resetPasswordInfo.email);

    await this.userService.update(user?.id, {
      ...user,
      password: await bcrypt.hash(resetPasswordInfo.newPassword, 10),
    });

    await this.cacheManager.del(user.email + ' ' + 'refresh');
  }
}

import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createReadStream } from 'fs';
import { basename, join } from 'path';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('avatar')
  async userAvatar(
    @Request() req: { user: { email: string } },
  ): Promise<StreamableFile> {
    const user: User | null = await this.userService.findOneByEmail(
      req.user.email,
    );

    if (!user) throw new NotFoundException('User with this email not exist');

    const file = createReadStream(join(user.avatar));

    return new StreamableFile(file, {
      type: `image/jpeg`,
      disposition: `inline; filename="${basename(user.avatar)}"`,
    });
  }
}

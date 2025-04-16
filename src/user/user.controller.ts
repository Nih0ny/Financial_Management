import {
  Controller,
  Get,
  NotFoundException,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createReadStream } from 'fs';
import { basename, join } from 'path';
import { User } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('avatar/:email')
  async userAvatar(@Param('email') email: string): Promise<StreamableFile> {
    const user: User | null = await this.userService.findOneByEmail(email);

    if (!user) throw new NotFoundException('User with this email not exist');

    const file = createReadStream(join(user.avatar));

    return new StreamableFile(file, {
      type: `image/jpeg`,
      disposition: `inline; filename="${basename(user.avatar)}"`,
    });
  }
}

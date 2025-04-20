import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [CategoryModule],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}

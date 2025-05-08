import { Module } from '@nestjs/common';
import { ContentCreatorController } from './content-creator.controller';
import { ContentCreatorService } from './content-creator.service';
import { OpenaiModule } from '../openai/openai.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [OpenaiModule, PrismaModule],
  controllers: [ContentCreatorController],
  providers: [ContentCreatorService],
  exports: [ContentCreatorService],
})
export class ContentCreatorModule {} 
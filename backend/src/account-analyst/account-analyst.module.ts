import { Module } from '@nestjs/common';
import { AccountAnalystController } from './account-analyst.controller';
import { AccountAnalystService } from './account-analyst.service';
import { OpenAIService } from '../openai/openai.service';

@Module({
  controllers: [AccountAnalystController],
  providers: [AccountAnalystService, OpenAIService],
})
export class AccountAnalystModule {} 
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AccountAnalystService } from './account-analyst.service';

interface AnalyzeAccountDto {
  url: string;
}

@Controller('analyze-account')
export class AccountAnalystController {
  constructor(private readonly accountAnalystService: AccountAnalystService) {}

  @Post()
  async analyzeAccount(@Body() analyzeAccountDto: AnalyzeAccountDto) {
    try {
      const analysis = await this.accountAnalystService.analyzeAccount(analyzeAccountDto.url);
      return analysis;
    } catch (error) {
      throw new HttpException(
        'Failed to analyze account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 
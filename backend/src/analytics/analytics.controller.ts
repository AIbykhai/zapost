import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('metrics')
  async getKeyMetrics(
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getKeyMetrics(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('recent-posts')
  async getRecentPosts(
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('platform') platform?: string,
  ) {
    return this.analyticsService.getRecentPosts(
      userId,
      new Date(startDate),
      new Date(endDate),
      platform,
    );
  }

  @Get('platform-metrics')
  async getPlatformMetrics(
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getPlatformMetrics(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }
} 
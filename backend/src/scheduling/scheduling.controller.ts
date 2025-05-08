import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post()
  async createScheduledPost(@Body() data: any) {
    return this.schedulingService.createScheduledPost(data);
  }

  @Get()
  async getScheduledPosts(@Query('userId') userId: string) {
    return this.schedulingService.getScheduledPosts(userId);
  }

  @Get(':id')
  async getScheduledPost(@Param('id') id: string) {
    return this.schedulingService.getScheduledPost(id);
  }

  @Put(':id')
  async updateScheduledPost(@Param('id') id: string, @Body() data: any) {
    return this.schedulingService.updateScheduledPost(id, data);
  }

  @Delete(':id')
  async deleteScheduledPost(@Param('id') id: string) {
    return this.schedulingService.deleteScheduledPost(id);
  }
} 
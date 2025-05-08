import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulingService {
  constructor(private prisma: PrismaService) {}

  async createScheduledPost(data: any) {
    const { content, userId, platform, scheduledTime, imageUrl } = data;
    
    // First create a post
    const post = await this.prisma.post.create({
      data: {
        userId,
        content,
        platform,
        status: 'scheduled',
      },
    });

    // Then create a scheduled post linked to the post
    return this.prisma.scheduledPost.create({
      data: {
        postId: post.id,
        platform,
        scheduledTime: new Date(scheduledTime),
        status: 'pending',
      },
    });
  }

  async getScheduledPosts(userId: string) {
    return this.prisma.post.findMany({
      where: {
        userId,
        status: 'scheduled',
      },
      include: {
        scheduledPosts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getScheduledPost(id: string) {
    return this.prisma.scheduledPost.findUnique({
      where: {
        id,
      },
      include: {
        post: true,
      },
    });
  }

  async updateScheduledPost(id: string, data: any) {
    const { content, platform, scheduledTime, status } = data;

    // Get the scheduled post to find the associated post
    const scheduledPost = await this.prisma.scheduledPost.findUnique({
      where: { id },
    });

    if (!scheduledPost) {
      throw new Error('Scheduled post not found');
    }

    // Update the post content if provided
    if (content) {
      await this.prisma.post.update({
        where: { id: scheduledPost.postId },
        data: {
          content,
          platform: platform || undefined,
        },
      });
    }

    // Update the scheduled post
    return this.prisma.scheduledPost.update({
      where: { id },
      data: {
        platform: platform || undefined,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
        status: status || undefined,
      },
    });
  }

  async deleteScheduledPost(id: string) {
    // Get the scheduled post to find the associated post
    const scheduledPost = await this.prisma.scheduledPost.findUnique({
      where: { id },
    });

    if (!scheduledPost) {
      throw new Error('Scheduled post not found');
    }

    // Delete the scheduled post
    await this.prisma.scheduledPost.delete({
      where: { id },
    });

    // Also delete the associated post
    return this.prisma.post.delete({
      where: { id: scheduledPost.postId },
    });
  }
} 
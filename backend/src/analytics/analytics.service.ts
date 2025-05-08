import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  constructor(private prisma: PrismaService) {}

  async getKeyMetrics(userId: string, startDate: Date, endDate: Date) {
    this.logger.debug(`Getting metrics for userId: ${userId}, from: ${startDate}, to: ${endDate}`);
    
    // Log Prisma schema field names for debugging
    this.logger.debug('Prisma Post schema expected fields: userId, createdAt, scheduledPosts');
    
    const posts = await this.prisma.post.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        scheduledPosts: true,
      },
    });

    this.logger.debug(`Found ${posts.length} posts`);
    if (posts.length > 0) {
      this.logger.debug(`First post object keys: ${Object.keys(posts[0]).join(', ')}`);
      // Check if reach and engagement exist
      this.logger.debug(`Post has reach property: ${posts[0].hasOwnProperty('reach')}`);
      this.logger.debug(`Post has engagement property: ${posts[0].hasOwnProperty('engagement')}`);
    }

    const totalPosts = posts.length;
    const scheduledPosts = posts.filter(post => post.scheduledPosts.length > 0).length;
    const totalReach = posts.reduce((sum, post) => sum + (post.reach || 0), 0);
    const totalEngagement = posts.reduce((sum, post) => sum + (post.engagement || 0), 0);

    return {
      totalPosts,
      scheduledPosts,
      totalReach,
      totalEngagement,
    };
  }

  async getRecentPosts(userId: string, startDate: Date, endDate: Date, platform?: string) {
    this.logger.debug(`Getting recent posts for userId: ${userId}, from: ${startDate}, to: ${endDate}, platform: ${platform || 'all'}`);
    
    const where = {
      userId: userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(platform && { platform }),
    };

    this.logger.debug('Where clause:', where);

    return this.prisma.post.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  }

  async getPlatformMetrics(userId: string, startDate: Date, endDate: Date) {
    this.logger.debug(`Getting platform metrics for userId: ${userId}, from: ${startDate}, to: ${endDate}`);
    
    const posts = await this.prisma.post.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    this.logger.debug(`Found ${posts.length} posts for platform metrics`);

    const platformMetrics = posts.reduce((acc, post) => {
      const platform = post.platform;
      if (!acc[platform]) {
        acc[platform] = {
          totalPosts: 0,
          totalReach: 0,
          totalEngagement: 0,
        };
      }
      acc[platform].totalPosts++;
      acc[platform].totalReach += post.reach || 0;
      acc[platform].totalEngagement += post.engagement || 0;
      return acc;
    }, {});

    return platformMetrics;
  }
} 
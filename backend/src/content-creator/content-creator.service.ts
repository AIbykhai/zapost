import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

interface GenerateContentParams {
  prompt: string;
  theme: string;
  platform: string;
  userId?: string;
}

@Injectable()
export class ContentCreatorService {
  private openai: OpenAI;
  private costPerToken = 0.002 / 1000; // $0.002 per 1000 tokens
  
  constructor(
    private openAIService: OpenAIService,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateContent({ prompt, theme, platform, userId }: GenerateContentParams) {
    const platformInfo = this.getPlatformInfo(platform);
    
    // Get user's brand profile if available
    let brandProfile = null;
    if (userId) {
      brandProfile = await this.prismaService.brandProfile.findFirst({
        where: { userId },
      });
    }

    // Create system prompt based on platform, theme, and brand profile
    const systemPrompt = this.createSystemPrompt(platformInfo, theme, brandProfile);
    
    // Generate content using OpenAI
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: platformInfo.maxTokens,
    });

    // Extract content and add generated hashtags
    let content = response.choices[0].message.content.trim();
    
    // Add hashtags if platform supports them
    if (platformInfo.supportsHashtags) {
      content = await this.addHashtags(content, theme);
    }

    // Track token usage for cost monitoring
    const usage = response.usage;
    if (usage && userId) {
      await this.trackTokenUsage(userId, usage.total_tokens);
    }

    return { content };
  }

  private getPlatformInfo(platform: string) {
    const platformInfo = {
      twitter: {
        charLimit: 280,
        maxTokens: 100,
        supportsHashtags: true,
        hashtags: 2,
      },
      instagram: {
        charLimit: 2200,
        maxTokens: 800,
        supportsHashtags: true,
        hashtags: 5,
      },
      linkedin: {
        charLimit: 3000,
        maxTokens: 1000,
        supportsHashtags: true,
        hashtags: 3,
      },
      facebook: {
        charLimit: 5000,
        maxTokens: 1500,
        supportsHashtags: true,
        hashtags: 2,
      },
    };

    return platformInfo[platform] || platformInfo.twitter;
  }

  private createSystemPrompt(platformInfo, theme, brandProfile) {
    let prompt = `You are an expert social media content writer. Create a ${theme} post for ${platformInfo.name} with maximum ${platformInfo.charLimit} characters. The content should be engaging and include a hook at the beginning and a call-to-action at the end.`;

    // Add brand profile info if available
    if (brandProfile) {
      prompt += `\n\nWrite in the brand's voice: ${brandProfile.voice}`;
      prompt += `\nUse vocabulary that matches: ${brandProfile.vocabulary}`;
      prompt += `\nThe tone should be: ${brandProfile.tone}`;
      prompt += `\nTarget audience: ${brandProfile.targetAudience}`;
    }

    return prompt;
  }

  private async addHashtags(content: string, theme: string) {
    // Generate relevant hashtags based on the content and theme
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Generate 3-5 relevant hashtags for the following ${theme} social media post. Return only the hashtags, separated by spaces, with no explanation.`,
        },
        { role: 'user', content },
      ],
      temperature: 0.5,
      max_tokens: 100,
    });

    const hashtags = response.choices[0].message.content.trim();
    return `${content}\n\n${hashtags}`;
  }

  private async trackTokenUsage(userId: string, tokens: number) {
    const cost = tokens * this.costPerToken;
    
    // Log token usage for monitoring
    console.log(`User ${userId} used ${tokens} tokens at a cost of $${cost.toFixed(6)}`);
    
    // In the future, we could store this in a database for cost tracking
    // await this.prismaService.tokenUsage.create({
    //   data: {
    //     userId,
    //     tokens,
    //     cost,
    //     timestamp: new Date(),
    //   },
    // });
  }
} 
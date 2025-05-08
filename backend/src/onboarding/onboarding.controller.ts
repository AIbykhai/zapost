import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { BrandProfile } from '../types/brand-profile.type';

interface ContentAnalysisDto {
  importMethod: 'text' | 'link';
  content: string;
  vocabularyList?: string;
}

interface BrandProfileDto {
  brandVoice: string;
  vocabularyList: string[];
  tone: string;
  targetAudience: string;
}

@Controller('api/onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('analyze-content')
  async analyzeContent(@Body() contentAnalysisDto: ContentAnalysisDto): Promise<BrandProfile> {
    try {
      const profile = await this.onboardingService.analyzeContent(
        contentAnalysisDto.importMethod,
        contentAnalysisDto.content,
        contentAnalysisDto.vocabularyList
      );
      return profile;
    } catch (error) {
      throw new HttpException(
        'Failed to analyze content',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('save-brand-profile')
  async saveBrandProfile(@Body() brandProfileDto: BrandProfileDto): Promise<{ success: boolean; profile: BrandProfile }> {
    try {
      const profile = await this.onboardingService.saveBrandProfile(brandProfileDto);
      return profile;
    } catch (error) {
      throw new HttpException(
        'Failed to save brand profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 
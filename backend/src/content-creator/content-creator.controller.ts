import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ContentCreatorService } from './content-creator.service';

// This would be a real auth guard in production
// import { AuthGuard } from '@nestjs/passport';
// Also using a mock user ID for now since we haven't set up authentication yet
const MOCK_USER_ID = 'mock-user-123';

// Define DTO (Data Transfer Object) for content generation request
class GenerateContentDto {
  prompt: string;
  theme: string;
  platform: string;
}

@Controller('content')
export class ContentCreatorController {
  constructor(private readonly contentCreatorService: ContentCreatorService) {}

  @Post('generate')
  // @UseGuards(AuthGuard('jwt')) // This would be used in production
  async generateContent(@Body() generateContentDto: GenerateContentDto) {
    try {
      // Validate inputs
      const { prompt, theme, platform } = generateContentDto;
      
      if (!prompt || !theme || !platform) {
        throw new HttpException(
          'Missing required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Add mock user ID
      // In a real app, we would get the user ID from the request
      return await this.contentCreatorService.generateContent({
        ...generateContentDto,
        userId: MOCK_USER_ID,
      });
    } catch (error) {
      // Handle known errors
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Log the error for monitoring
      console.error('Content generation error:', error);
      
      // Return a friendly error message
      throw new HttpException(
        'Failed to generate content. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 
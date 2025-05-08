import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async analyzeContent(content: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert social media analyst. Analyze the following content and provide a title, hook, and theme.',
        },
        {
          role: 'user',
          content: content,
        },
      ],
      temperature: 0.7,
    });

    const analysis = response.choices[0].message.content;
    const [title, hook, theme] = analysis.split('\n').map((line) => line.trim());

    return {
      title: title.replace('Title: ', ''),
      hook: hook.replace('Hook: ', ''),
      theme: theme.replace('Theme: ', ''),
    };
  }
} 
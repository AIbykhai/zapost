import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AccountAnalystModule } from './account-analyst/account-analyst.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ContentCreatorModule } from './content-creator/content-creator.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { AnalyticsModule } from './analytics/analytics.module';

const optionalModules = process.env.NODE_ENV === 'test'
  ? []
  : [AccountAnalystModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    ...optionalModules,
    OnboardingModule,
    ContentCreatorModule,
    SchedulingModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

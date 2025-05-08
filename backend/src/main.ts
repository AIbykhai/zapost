import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.debug('Starting application...');
  
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  logger.debug('CORS enabled');
  
  // Add rate limiting
  app.use(
    rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later',
    }),
  );
  logger.debug('Rate limiting configured');
  
  // Add session handling
  app.use(
    session({
      secret: process.env.JWT_SECRET || 'your-super-secret-key-here',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 60 * 1000, // 30 minutes
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );
  logger.debug('Session middleware configured');
  
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application started on port ${process.env.PORT ?? 3000}`);
}
bootstrap();

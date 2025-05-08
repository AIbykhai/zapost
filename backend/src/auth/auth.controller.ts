import { Controller, Post, Body, HttpException, HttpStatus, HttpCode, Get, UseGuards, Req, Res, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

// Define an interface to extend Express Request type
interface RequestWithUser extends Request {
  user: any; // Define a more specific type if you know the structure
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.authService.register(body.email, body.password);
      return { message: 'User registered successfully', userId: user.id };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Registration failed',
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.authService.login(body.email, body.password);
      return { message: 'Login successful', userId: user.id };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Login failed',
          message: error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  async loginAuth0() {
    // Auth0 will handle the login
    this.logger.debug('Auth0 login initiated');
  }

  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req: RequestWithUser, @Res() res: Response) {
    this.logger.debug('Auth0 callback received');
    this.logger.debug(`User from request: ${req.user ? 'present' : 'missing'}`);
    if (req.user) {
      this.logger.debug(`User properties: ${Object.keys(req.user).join(', ')}`);
    }
    
    const user = await this.authService.validateUser(req.user);
    const token = await this.authService.generateToken(user);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('auth0'))
  getProfile(@Req() req: RequestWithUser) {
    this.logger.debug('Getting profile');
    this.logger.debug(`User from request: ${req.user ? 'present' : 'missing'}`);
    return req.user;
  }
} 
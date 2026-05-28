import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto } from '../common/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body.email, body.password, body.cf_turnstile_token, {
      full_name: body.full_name,
      joiningDate: body.joiningDate,
      phone: body.phone,
      date_of_birth: body.date_of_birth,
    });
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async signIn(@Body() body: LoginDto) {
    return this.authService.signIn(body.email, body.password, body.cf_turnstile_token);
  }

  @Post('logout')
  async signOut() {
    return this.authService.signOut('');
  }

  @Get('session')
  async getSession() {
    return this.authService.getSession();
  }

  @Post('google')
  async signInWithGoogle() {
    return this.authService.signInWithGoogle();
  }
}

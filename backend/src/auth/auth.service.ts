import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

@Injectable()
export class AuthService {

  constructor(
    private supabase: SupabaseService,
    private configService: ConfigService,
  ) {}

  private async verifyTurnstile(token: string): Promise<void> {
    const secretKey = this.configService.get<string>('TURNSTILE_SECRET_KEY');
    if (!secretKey) return;

    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
    });
    const result = await res.json();
    if (!result.success) {
      throw new BadRequestException('CAPTCHA verification failed. Please try again.');
    }
  }

  async signUp(email: string, password: string, cfTurnstileToken: string, metadata?: { full_name?: string; joiningDate?: string }) {
    await this.verifyTurnstile(cfTurnstileToken);
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {},
      },
    });

    if (error) throw new ConflictException(error.message);

    if (data?.user?.id) {
      const { error: adminError } = await this.supabase.admin.auth.admin.updateUserById(
        data.user.id,
        { email_confirm: true }
      );
      if (adminError) {
        console.warn('Auto-confirm failed, user may need to verify email:', adminError.message);
      }
    }

    return data;
  }

  async signIn(email: string, password: string, cfTurnstileToken: string) {
    await this.verifyTurnstile(cfTurnstileToken);
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new UnauthorizedException(error.message);
    return data;
  }

  async signOut(accessToken: string) {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new InternalServerErrorException(error.message);
    return { success: true };
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}

import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {

  constructor(
    private supabase: SupabaseService,
  ) {}

  async signUp(email: string, password: string, metadata?: { full_name?: string; joiningDate?: string }) {
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

  async signIn(email: string, password: string) {
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

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  private readonly pepper: string;

  constructor(
    private supabase: SupabaseService,
    private configService: ConfigService,
  ) {
    this.pepper = this.configService.get<string>('PASSWORD_PEPPER') || 'BananaSecurePepper2024!';
  }

  private applyPepper(password: string): string {
    const hash = createHash('sha256')
      .update(password + this.pepper)
      .digest('hex');
    return `P${hash}`;
  }

  async signUp(email: string, password: string, metadata?: { full_name?: string; joiningDate?: string }) {
    const pepperedPassword = this.applyPepper(password);

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password: pepperedPassword,
      options: {
        data: metadata || {},
      },
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const pepperedPassword = this.applyPepper(password);

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password: pepperedPassword,
    });

    if (error) throw error;
    return data;
  }

  async signOut(accessToken: string) {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data;
  }

  async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
    return data;
  }
}

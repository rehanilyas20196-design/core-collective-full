import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.getOrThrow<string>('SUPABASE_URL');
    const supabaseKey = this.configService.getOrThrow<string>('SUPABASE_ANON_KEY');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.supabaseAdmin = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
      : this.supabase;
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  get admin(): SupabaseClient {
    return this.supabaseAdmin;
  }

  get auth() {
    return this.supabase.auth;
  }

  from(table: string) {
    return this.supabaseAdmin.from(table);
  }

  storage() {
    return this.supabaseAdmin.storage;
  }
}

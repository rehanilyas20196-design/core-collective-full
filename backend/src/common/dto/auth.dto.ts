import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password too long' })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  full_name?: string;

  @IsOptional()
  @IsString()
  joiningDate?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  cf_turnstile_token?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  cf_turnstile_token?: string;
}

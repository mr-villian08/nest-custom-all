import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { AuthLoginDto } from './create-auth-login.dto';

export class AuthRegisterDto extends AuthLoginDto {
  @IsNotEmpty({
    message: 'First name is required.',
  })
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsNotEmpty({
    message: 'Username is required.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username may only contain letters, numbers and underscores.',
  })
  username?: string;

  @IsNotEmpty({
    message: 'Phone number is required.',
  })
  @IsPhoneNumber('IN', {
    message: 'Please enter a valid phone number.',
  })
  phone?: string;

  @IsNotEmpty({
    message: 'Role is required.',
  })
  role?: string;
}

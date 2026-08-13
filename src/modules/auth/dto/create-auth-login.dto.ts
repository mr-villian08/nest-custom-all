import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty({
    message: 'Email is required.',
  })
  @IsEmail(
    {},
    {
      message: 'Please enter a valid email address.',
    },
  )
  email?: string;

  @IsNotEmpty({
    message: 'Password is required.',
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long.',
  })
  password?: string;
}

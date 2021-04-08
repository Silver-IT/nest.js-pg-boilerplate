import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserGender, UserRole } from '../enums/users.enum';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}

export class RegisterUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ enum: UserGender, default: UserGender.Male })
  @IsEnum(UserGender)
  @IsNotEmpty()
  readonly gender: UserGender;

  @ApiProperty({ default: 631166400000 })
  @IsNumber()
  readonly birthdayTimestamp: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.Customer })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role: UserRole;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  token: string;
}

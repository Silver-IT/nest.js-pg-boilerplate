import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Exclude } from 'class-transformer';

import { UserGender, UserRole, UserStatus } from '../enums/users.enum';
import { User } from '../../entities/user.entity';

export class UserDto {
  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

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
  @Exclude()
  readonly password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.Customer })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role: UserRole;

  @ApiProperty()
  @IsBoolean()
  readonly isEmailVerified: boolean;

  @ApiProperty({ enum: UserStatus, default: UserStatus.Approved })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  readonly status: UserStatus;

  constructor(user?: User) {
    if (!user) {
      this.gender = UserGender.Male;
      this.role = UserRole.Customer;
    } else {
      this.createdAt = user.createdAt;
      this.updatedAt = user.updatedAt;
      this.id = user.id;
      this.email = user.email;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.gender = user.gender;
      this.birthdayTimestamp = user.birthday.getTime();
      this.role = user.role;
      this.isEmailVerified = user.isEmailVerified;
      this.status = user.status;
    }
  }
}

export class UserStatusUpdateDto {
  @ApiProperty({ enum: UserStatus, default: UserStatus.Approved })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  readonly status: UserStatus;
}

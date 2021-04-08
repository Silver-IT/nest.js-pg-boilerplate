import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { UserRole } from '../enums/users.enum';

export class JwtPayloadModel {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;

  constructor(
    id: string,
    email: string,
    role: UserRole,
    firstName: string,
    lastName: string,
  ) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  toJson() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}

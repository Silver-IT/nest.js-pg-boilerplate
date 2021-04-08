import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isUUID } from 'class-validator';

import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterUserDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from '../common/dtos/auth.dto';
import {
  AccessTokenResponse,
  SuccessResponse,
} from '../common/dtos/response-types.dto';
import { JwtPayloadModel } from '../common/models/jwt-payload.model';
import { UserDto } from '../common/dtos/user.dto';
import { ForgotPasswordModel } from '../common/models/emails.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user: User = await this.usersService.findUserByEmail(loginDto.email);
    if (user && (await user.comparePassword(loginDto.password))) {
      return user;
    }
    return null;
  }

  login(user: User): AccessTokenResponse {
    const payload = new JwtPayloadModel(
      user.id,
      user.email,
      user.role,
      user.firstName,
      user.lastName,
    );
    const accessToken = this.jwtService.sign(payload.toJson());
    return new AccessTokenResponse(accessToken);
  }

  async register(userDto: RegisterUserDto): Promise<SuccessResponse> {
    const user = await this.usersService.register(userDto);
    return this.usersService.sendVerificationEmail(user.email, user.id);
  }

  async getProfile(userDto: JwtPayloadModel): Promise<UserDto> {
    const prvUser = await this.usersService.findUserById(userDto.id);
    return new UserDto(prvUser);
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<SuccessResponse> {
    const resetLink = await this.usersService.validateResetPasswordToken(
      resetPasswordDto.token,
    );

    if (!resetLink) {
      throw new BadRequestException('Password reset token is invalid.');
    } else if (resetLink.expireDate < new Date()) {
      throw new BadRequestException('Password reset token has expired.');
    }

    return await this.usersService.changePassword(
      resetLink.email,
      resetPasswordDto.password,
    );
  }

  async verifyEmail(confirmEmailDto: VerifyEmailDto): Promise<SuccessResponse> {
    if (!isUUID(confirmEmailDto.token)) {
      throw new BadRequestException('Email verification url is not valid.');
    }
    return await this.usersService.verifyEmail(confirmEmailDto.token);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.findUserByEmail(
      forgotPasswordDto.email,
    );
    if (!user) {
      throw new BadRequestException(
        `${forgotPasswordDto.email} is not a valid account.`,
      );
    }

    const resetToken = await this.usersService.getResetPasswordToken(
      forgotPasswordDto.email,
    );
    const fpModel = new ForgotPasswordModel(
      forgotPasswordDto.email,
      `${user.firstName} ${user.lastName}`,
      resetToken,
    );

    return await this.usersService.sendForgotPasswordEmail(fpModel);
  }
}

import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { EmailsService } from '../emails/emails.service';
import { User } from '../entities/user.entity';
import { PasswordResetLink } from '../entities/password-reset-link.entity';
import { UserRole, UserStatus } from '../common/enums/users.enum';
import { RegisterUserDto } from '../common/dtos/auth.dto';
import { SuccessResponse } from '../common/dtos/response-types.dto';
import {
  ForgotPasswordModel,
  EmailVerificationModel,
} from '../common/models/emails.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(PasswordResetLink)
    private readonly passwordResetLinksRepository: Repository<PasswordResetLink>,
    private emailsService: EmailsService,
  ) {}

  findUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  findUserById(id: string): Promise<User> {
    return this.usersRepository.findOne({ id });
  }

  countByRole(role?: UserRole): Promise<number> {
    if (!role) {
      return this.usersRepository.count({});
    } else {
      return this.usersRepository.count({ role });
    }
  }

  async register(
    body: RegisterUserDto,
    errorReport = true,
  ): Promise<User | null> {
    const found = await this.findUserByEmail(body.email);
    if (found) {
      if (errorReport) {
        throw new BadRequestException(`Email has already been taken.`);
      } else {
        return null;
      }
    }
    const user = new User();
    user.email = body.email.toLowerCase();
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.gender = body.gender;
    user.birthday = new Date(body.birthdayTimestamp);
    user.role = body.role;
    user.password = body.password;
    user.isEmailVerified = false;
    user.status = UserStatus.Approved;
    return this.usersRepository.save(user);
  }

  async add(body: RegisterUserDto): Promise<User | null> {
    try {
      return this.register(body, false);
    } catch (err) {
      return null;
    }
  }

  async deleteUser(userId: string): Promise<SuccessResponse> {
    const user: User = await this.findUserById(userId);
    if (user) {
      await this.usersRepository.softRemove(user);
    }
    return new SuccessResponse();
  }

  async updateUserStatus(
    userId: string,
    status: UserStatus,
  ): Promise<SuccessResponse> {
    const user: User = await this.findUserById(userId);
    if (user) {
      user.status = status;
      await this.usersRepository.save(user);
    }
    return new SuccessResponse();
  }

  async getResetPasswordToken(email: string): Promise<string> {
    await this.passwordResetLinksRepository.delete({ email: email });
    const passwordResetLink = new PasswordResetLink(email);
    const link = await this.passwordResetLinksRepository.save(
      passwordResetLink,
    );
    return link.id;
  }

  async sendForgotPasswordEmail(
    fpModel: ForgotPasswordModel,
  ): Promise<SuccessResponse> {
    const isSentEmail = await this.emailsService.sendForgotPasswordEmail(
      fpModel,
    );
    if (isSentEmail) {
      return new SuccessResponse();
    } else {
      throw new ServiceUnavailableException(
        'Reset Password email has not been sent. The Email service is currently unavailable.',
      );
    }
  }

  async changePassword(
    email: string,
    password: string,
  ): Promise<SuccessResponse> {
    const user: User = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(
        `${user.email} is not a registered account.`,
      );
    }
    user.password = password;
    await user.preProcess();
    await this.usersRepository.save(user);
    await this.passwordResetLinksRepository.delete({ email });
    return new SuccessResponse();
  }

  async sendVerificationEmail(
    email: string,
    id: string,
  ): Promise<SuccessResponse> {
    if (!id) {
      const user = await this.findUserByEmail(email);
      if (!user)
        throw new BadRequestException(`${email} is not registered yet.`);
      id = user.id;
    }
    const isSentEmail = await this.emailsService.sendValidationEmail(
      new EmailVerificationModel(email, id),
    );
    if (isSentEmail) {
      return new SuccessResponse();
    } else {
      throw new ServiceUnavailableException(
        'Confirmation email has not been sent. The Email service is currently unavailable.',
      );
    }
  }

  async validateResetPasswordToken(
    token: string,
  ): Promise<PasswordResetLink | undefined> {
    if (!isUUID(token)) {
      throw new BadRequestException('Password reset token is invalid.');
    }
    return await this.passwordResetLinksRepository.findOne({ id: token });
  }

  async verifyEmail(id: string): Promise<SuccessResponse> {
    const user = await this.usersRepository.findOne({ id: id });
    if (!user) {
      throw new BadRequestException('Email verification url is not valid.');
    }
    user.isEmailVerified = true;
    await this.usersRepository.save(user);
    return new SuccessResponse();
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailsModule } from '../emails/emails.module';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { PasswordResetLink } from '../entities/password-reset-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PasswordResetLink]), EmailsModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

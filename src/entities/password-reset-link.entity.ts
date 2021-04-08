import { BeforeInsert, Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

import { resetPasswordLinkExpireHours } from '../common/constants/general.constants';
import { BaseEntity } from './base';

@Entity('password_reset_links')
export class PasswordResetLink extends BaseEntity {
  @Column()
  email: string;

  @Column()
  @Exclude()
  expireDate: Date;

  @BeforeInsert()
  updateDate() {
    const expire = new Date();
    expire.setHours(expire.getHours() + resetPasswordLinkExpireHours);
    this.expireDate = expire;
  }

  constructor(email) {
    super();
    this.email = email;
  }
}

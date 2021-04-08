import { BeforeInsert, Column, Entity } from 'typeorm';
import { compare, hash } from 'bcrypt';

import { UserGender, UserRole, UserStatus } from '../common/enums/users.enum';
import { BaseEntity } from './base';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: UserGender })
  gender: UserGender;

  @Column()
  birthday: Date;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  password: string;

  @Column()
  isEmailVerified: boolean;

  @Column({ type: 'enum', enum: UserStatus })
  status: UserStatus;

  @BeforeInsert()
  preProcess() {
    return hash(this.password, 10).then(
      (encrypted) => (this.password = encrypted),
    );
  }

  async comparePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}

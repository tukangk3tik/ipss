import { PasswordHash } from '../../../_domain/security/password.hash';
import * as bcrypt from 'bcrypt';
import { passwordHash } from '../constant';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptPasswordHash implements PasswordHash {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, passwordHash.saltRound);
  }

  async comparePassword(plain: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(plain, encrypted);
  }
}

import { Injectable } from '@nestjs/common';
import { AccountRepositoryImpl } from '../repositories/account.repository.impl';
import { AccountEntity } from '../entities/account.entity';
import { AccountRepository } from '../../_domain/repositories/account.repository';

@Injectable()
export class AccountService {
  private accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepositoryImpl) {
    this.accountRepository = accountRepository;
  }

  async getAccountByEmail(email: string): Promise<AccountEntity | null> {
    return this.accountRepository.getAccountByEmail(email);
  }
}

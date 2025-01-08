import { AccountEntity } from '../../account/entities/account.entity';

export interface AccountRepository {
  getAccountByEmail(email: string): Promise<AccountEntity>;
  getAccountById(id: string): Promise<AccountEntity>;
}

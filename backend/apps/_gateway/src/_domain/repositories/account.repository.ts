import { AccountEntity } from '../../account/entities/account.entity';

export interface AccountRepository {
  getAccountByEmail(email: string): Promise<AccountEntity | null>;
  getAccountById(id: string): Promise<AccountEntity | null>;
}

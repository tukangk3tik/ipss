import { Transform } from 'class-transformer';
import { Account } from '../../_domain/models/account';
import { MasterSite } from '../../_domain/models/master.site';
import { MasterAccountPosition } from '../../_domain/models/master.account.position';

export class AccountEntity implements Account {
  id: string;
  code: string;
  email: string;
  fullname: string;
  password: string;

  @Transform(({ value }) => value.name)
  site: MasterSite;

  @Transform(({ value }) => value.name)
  position: MasterAccountPosition;

  head?: string | null;

  constructor(partial: Partial<AccountEntity>) {
    Object.assign(this, partial);
  }
}

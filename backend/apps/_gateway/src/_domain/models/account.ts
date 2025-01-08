import { MasterAccountPosition } from './master.account.position';
import { MasterSite } from './master.site';

export interface Account {
  id: string;
  code: string;
  email: string;
  fullname: string;
  site: MasterSite;
  position: MasterAccountPosition;
  head?: string | null;
}

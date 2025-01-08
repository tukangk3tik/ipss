import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../_domain/repositories/account.repository';
import { PrismaService } from '../../_infrastructure/database/prisma/prisma.service';
import { AccountEntity } from '../entities/account.entity';

@Injectable()
export class AccountRepositoryImpl implements AccountRepository {
  constructor(private prisma: PrismaService) {}

  async getAccountByEmail(email: string): Promise<AccountEntity> {
    const account = await this.prisma.accounts.findUnique({
      where: { email: email, deleted_at: null },
      include: {
        position: true,
        site: true,
      },
    });

    if (!account) {
      throw new Error('User not found');
    }

    return new AccountEntity({
      id: account.id,
      code: account.code,
      email: account.email,
      fullname: account.fullname,
    });
  }

  async getAccountById(id: string): Promise<AccountEntity> {
    const account = await this.prisma.accounts.findUnique({
      where: { id: id, deleted_at: null },
      include: {
        position: true,
        site: true,
      },
    });

    if (!account) {
      throw new Error('User not found');
    }

    let head = null;
    if (!account.head_id) {
      head = await this.prisma.accounts.findUnique({
        where: { id: account.head_id, deleted_at: null },
        include: {
          position: true,
          site: true,
        },
      });
    }

    return new AccountEntity({
      id: account.id,
      code: account.code,
      email: account.email,
      fullname: account.fullname,
      position: account.position,
      site: account.site,
      head: head?.fullname ?? '',
    });
  }
}

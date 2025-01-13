import { Module } from '@nestjs/common';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { DatabaseModule } from '../_infrastructure/database/database.module';
import { AccountRepositoryImpl } from './repositories/account.repository.impl';

@Module({
  imports: [DatabaseModule],
  providers: [AccountService, AccountRepositoryImpl],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}

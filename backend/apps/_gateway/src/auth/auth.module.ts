import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { DatabaseModule } from '../_infrastructure/database/database.module';
import { AccountModule } from '../account/account.module';
import { SecurityModule } from '../_infrastructure/security/security.module';
import { AuthRepositoryImpl } from './repositories/auth.repository.impl';

@Module({
  imports: [DatabaseModule, SecurityModule, AccountModule],
  providers: [AuthService, AuthRepositoryImpl],
  controllers: [AuthController],
})
export class AuthModule {}

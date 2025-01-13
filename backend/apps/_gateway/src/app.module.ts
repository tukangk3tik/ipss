import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './_infrastructure/database/database.module';
import { I18nLanguageModule } from './_i18n/i18n.module';

@Module({
  imports: [I18nLanguageModule, DatabaseModule, AccountModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

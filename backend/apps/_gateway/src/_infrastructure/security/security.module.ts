import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenManager } from './jwt/jwt.token.manager';
import { jwtConstants } from './constant';
import { BcryptPasswordHash } from './bcrypt/bcrypt.password.hash';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.accessTokenSecret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  providers: [JwtTokenManager, BcryptPasswordHash],
  exports: [JwtTokenManager, BcryptPasswordHash],
})
export class SecurityModule {}

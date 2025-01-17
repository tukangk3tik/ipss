import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountService } from '../../account/services/account.service';
import { AuthenticationTokenManager } from '../../_domain/security/authentication.token.manager';
import { JwtTokenManager } from '../../_infrastructure/security/jwt/jwt.token.manager';
import { PasswordHash } from '../../_domain/security/password.hash';
import { LoginDto } from '../dtos/login.dto';
import { GlobalResponse } from '../../_domain/dtos/global.response';
import { BcryptPasswordHash } from '../../_infrastructure/security/bcrypt/bcrypt.password.hash';
import { AuthPayload } from '../../_infrastructure/security/entities/auth.payload';
import { RefreshAuthDto } from '../dtos/refresh.auth.dto';
import { AuthRepository } from '../../_domain/repositories/auth.repository';
import { AuthRepositoryImpl } from '../repositories/auth.repository.impl';
import { LogoutDto } from '../dtos/logout.dto';
import { GlobalError } from '../../_domain/dtos/global.error';

@Injectable()
export class AuthService {
  private readonly authRepository: AuthRepository;
  private readonly jwtTokenManager: AuthenticationTokenManager;
  private readonly bcryptPasswordHash: PasswordHash;

  constructor(
    private readonly accountService: AccountService,

    authRepository: AuthRepositoryImpl,
    jwtTokenManager: JwtTokenManager,
    bcryptPasswordHash: BcryptPasswordHash,
  ) {
    this.authRepository = authRepository;
    this.jwtTokenManager = jwtTokenManager;
    this.bcryptPasswordHash = bcryptPasswordHash;
  }

  async login(payload: LoginDto): Promise<GlobalResponse> {
    const user = await this.accountService.getAccountByEmail(payload.email);

    if (!user) {
      const error = new GlobalError({
        error_key: 'errors.NOT_FOUND',
        error_args: { property: 'User' },
      });
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }

    const isPasswordMatch = await this.bcryptPasswordHash.comparePassword(
      payload.password,
      user.password,
    );

    if (!isPasswordMatch) {
      const error = new GlobalError({
        error_key: 'errors.AUTH.WRONG_PASSWORD',
        error_args: {},
      });
      throw new HttpException(error, HttpStatus.UNAUTHORIZED);
    }

    const authPayload = { id: user.id, email: user.email } as AuthPayload;
    const accessToken =
      await this.jwtTokenManager.createAccessToken(authPayload);

    const refreshToken =
      await this.jwtTokenManager.createRefreshToken(authPayload);

    await this.authRepository.addToken(refreshToken);

    return new GlobalResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Success',
      data: { access_token: accessToken, refresh_token: refreshToken },
    });
  }

  async refreshAuth(payload: RefreshAuthDto): Promise<GlobalResponse> {
    await this.jwtTokenManager.verifyRefreshToken(payload.refresh_token);
    await this.checkToken(payload.refresh_token);

    const { id, email } = await this.jwtTokenManager.decodePayload(
      payload.refresh_token,
    );

    const authPayload = { id: id, email: email } as AuthPayload;
    const accessToken =
      await this.jwtTokenManager.createAccessToken(authPayload);

    return new GlobalResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Success',
      data: { access_token: accessToken },
    });
  }

  async logout(payload: LogoutDto) {
    // delete from token module
    await this.jwtTokenManager.verifyRefreshToken(payload.refresh_token);
    await this.checkToken(payload.refresh_token);
    await this.authRepository.deleteToken(payload.refresh_token);

    return new GlobalResponse({
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: {},
    });
  }

  /**
   * ====================================
   * Function using more than 1
   */
  async checkToken(refreshToken: string) {
    const isTokenAvailable =
      await this.authRepository.checkAvailabilityToken(refreshToken);

    if (!isTokenAvailable) {
      const error = new GlobalError({
        error_key: 'errors.AUTH.REFRESH_TOKEN_NOT_FOUND',
        error_args: {},
      });
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
}

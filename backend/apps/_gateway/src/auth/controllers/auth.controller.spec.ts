import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RefreshAuthDto } from '../dtos/refresh.auth.dto';
import { LogoutDto } from '../dtos/logout.dto';
import { AuthRepositoryImpl } from '../repositories/auth.repository.impl';
import { SecurityModule } from '../../_infrastructure/security/security.module';
import { DatabaseModule } from '../../_infrastructure/database/database.module';
import { AccountModule } from '../../account/account.module';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GlobalError } from '../../_domain/dtos/global.error';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('dotenv').config({ path: `env/${process.env.NODE_ENV}.env` });

    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountModule, DatabaseModule, SecurityModule],
      controllers: [AuthController],
      providers: [AuthRepositoryImpl, AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should login - success', async () => {
    const loginDto: LoginDto = {
      email: 'zikri_test@ipss.com',
      password: 'password1234',
    };

    const result = await controller.login(loginDto);
    expect(result).toBeDefined();
    expect(result.statusCode).toEqual(201);
    expect(result.data.access_token).toBeDefined();
    expect(result.data.refresh_token).toBeDefined();
  });

  it('should login failed - user not found', async () => {
    const loginDto: LoginDto = {
      email: 'zikri_test1234@ipss.com',
      password: 'password1234',
    };

    await expect(controller.login(loginDto)).rejects.toThrow(
      new HttpException(
        new GlobalError({
          error_key: 'errors.NOT_FOUND',
          error_args: { property: 'User' },
        }),
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should login failed - wrong password', async () => {
    const loginDto: LoginDto = {
      email: 'zikri_test@ipss.com',
      password: '1234',
    };

    await expect(controller.login(loginDto)).rejects.toThrow(
      new HttpException(
        new GlobalError({
          error_key: 'errors.AUTH.WRONG_PASSWORD',
          error_args: {},
        }),
        HttpStatus.UNAUTHORIZED,
      ),
    );
  });

  it('should refresh auth', async () => {
    const loginDto: LoginDto = {
      email: 'zikri_test@ipss.com',
      password: 'password1234',
    };

    const loginResult = await controller.login(loginDto);
    expect(loginResult.data.refresh_token).toBeDefined();

    const refreshAuthDto: RefreshAuthDto = {
      refresh_token: loginResult.data.refresh_token,
    };

    const result = await controller.refreshAuth(refreshAuthDto);
    expect(result).toBeDefined();
    expect(result.statusCode).toEqual(201);
    expect(result.data.access_token).toBeDefined();
  });

  it('should logout', async () => {
    const loginDto: LoginDto = {
      email: 'zikri_test@ipss.com',
      password: 'password1234',
    };

    const loginResult = await controller.login(loginDto);
    expect(loginResult.data.refresh_token).toBeDefined();

    const logoutDto: LogoutDto = {
      refresh_token: loginResult.data.refresh_token,
    };

    const result = await controller.logout(logoutDto);
    expect(result).toBeDefined();
    expect(result.statusCode).toEqual(200);
  });
});

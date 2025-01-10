import { JwtService } from '@nestjs/jwt';
import { AuthenticationTokenManager } from '../../../_domain/security/authentication.token.manager';
import { AuthPayload } from '../entities/auth.payload';
import { jwtConstants } from '../constant';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenManager implements AuthenticationTokenManager {
  constructor(private readonly jwtService: JwtService) {}

  async createAccessToken(payload: AuthPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async createRefreshToken(payload: AuthPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshTokenSecret,
    });
  }

  async verifyRefreshToken(token: string): Promise<void> {
    try {
      await this.jwtService.verify(token, {
        secret: jwtConstants.refreshTokenSecret,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async decodePayload(token: string): Promise<any> {
    const artifacts = this.jwtService.decode(token);
    return artifacts;
  }
}

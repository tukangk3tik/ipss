import { AuthPayload } from '../../_infrastructure/security/entities/auth.payload';

export interface AuthenticationTokenManager {
  createAccessToken(payload: AuthPayload): Promise<string>;
  createRefreshToken(payload: AuthPayload): Promise<string>;
  verifyRefreshToken(token: string): Promise<void>;
  decodePayload(token: string): Promise<any>;
}

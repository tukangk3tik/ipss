export interface AuthRepository {
  addToken(refreshToken: string): Promise<void>;
  checkAvailabilityToken(refreshToken: string): Promise<boolean>;
  deleteToken(refreshToken: string): Promise<void>;
}

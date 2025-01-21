import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../_domain/repositories/auth.repository';
import { PrismaService } from '../../_infrastructure/database/prisma/prisma.service';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async addToken(refreshToken: string): Promise<void> {
    await this.prismaService.auth_tokens.create({
      data: { refresh_token: refreshToken },
    });
  }

  async checkAvailabilityToken(refreshToken: string): Promise<boolean> {
    const token = await this.prismaService.auth_tokens.findFirst({
      where: { refresh_token: refreshToken },
    });

    if (!token) {
      return false;
    }

    return true;
  }

  async deleteToken(refreshToken: string): Promise<void> {
    await this.prismaService.auth_tokens.deleteMany({
      where: { refresh_token: refreshToken },
    });
  }
}

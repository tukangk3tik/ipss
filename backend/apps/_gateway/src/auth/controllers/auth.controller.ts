import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RefreshAuthDto } from '../dtos/refresh.auth.dto';
import { LogoutDto } from '../dtos/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Put('refresh')
  refreshAuth(@Body() refreshAuthDto: RefreshAuthDto) {
    return this.authService.refreshAuth(refreshAuthDto);
  }

  @Delete('logout')
  logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }
}

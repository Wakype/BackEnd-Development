import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(+id, token);
  }

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @UseGuards(JwtGuard) // impelementasi guard pada route , hal ini berarti endpoint profile hanya bisa diakses jika client membawa token
  @Get('profile')
  async getProfile(@Req() req) {
    // hasil validate dari jwt strategy akan ditambakan pada req.user. isi object req.user akan sama dengan payload dari jwt token. Silahkan coba console.log(req.user)
    const { id } = req.user;
    return this.authService.myProfile(id);
  }

  @Post('lupa-password')
  async forgotPassowrd(@Body('email') email: string) {
    console.log('email', email);
    return this.authService.forgotPassword(email);
  }
}

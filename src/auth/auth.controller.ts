import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

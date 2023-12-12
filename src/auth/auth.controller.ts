import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  /**
   * Log in a user using their email and password.
   * @param {LoginDto} body - The login data containing the user's email and password.
   * @returns {Promise<AuthEntity>} - A promise that resolves to the authentication token.
   */
  async login(@Body() body: LoginDto): Promise<AuthEntity> {
    return await this.authService.login(body.email, body.password);
  }
}

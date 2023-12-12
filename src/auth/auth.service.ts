import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
  /**
   * Creates a new instance of the class.
   *
   * @param prismaService - An instance of the PrismaService class.
   * @param jwtService - An instance of the JwtService class.
   */
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user by their email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns - An AuthEntity object containing the access token.
   * @throws - NotFoundException if no user is found for the given email.
   * @throws - UnauthorizedException if the password is invalid.
   */
  async login(email: string, password: string): Promise<AuthEntity> {
    // Find the user by their email
    const user = await this.prismaService.user.findUnique({ where: { email } });

    // Throw an exception if no user is found
    if (!user) {
      throw new NotFoundException(`No user found for email ${email}`);
    }

    // Compare the provided password with the user's password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Throw an exception if the password is invalid
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate and return the access token
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}

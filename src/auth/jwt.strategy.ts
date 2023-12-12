import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Constructs a new instance of the JwtStrategy class.
   *
   * @param usersService - An instance of the UsersService class.
   */
  constructor(private readonly usersService: UsersService) {
    super({
      // Extract the JWT from the request's Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Use the JWT secret from the environment variables as the secret key
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validates a user payload.
   *
   * @param payload - The payload containing the user ID.
   * @returns The user object if it exists.
   * @throws UnauthorizedException if the user does not exist.
   */
  async validate(payload: { userId: number }) {
    const user = await this.usersService.findOne(payload.userId);

    // Throw an exception if the user does not exist
    if (!user) throw new UnauthorizedException();

    return user;
  }
}

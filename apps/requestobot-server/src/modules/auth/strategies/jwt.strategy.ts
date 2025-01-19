import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../data-store/entities/user.entity';
import { JWT_COOKIE_NAME, JWT_SECRET } from '../../../injection-tokens';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(JWT_SECRET) private jwtSecret: string,
    @Inject(JWT_COOKIE_NAME) private jwtCookieName: string,
  ) {
    super({
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies[jwtCookieName];
        }

        return token;
      },
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: any) {
    const user = new User();
    user.id = payload.sub;
    user.username = payload.username;
    user.displayName = payload.displayName;

    return user;
  }
}

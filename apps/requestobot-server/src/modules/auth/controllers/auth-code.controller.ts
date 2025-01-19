import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import {
  JWT_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../../../injection-tokens';
import * as jsonwebtoken from 'jsonwebtoken';
import { UserJwt } from '../models/user-jwt';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from '../../data-store/services/user.service';

@Controller('auth-code/:authCode')
export class AuthCodeController {
  constructor(
    private authService: AuthService,
    @Inject(JWT_COOKIE_NAME) private jwtCookieName: string,
    @Inject(REFRESH_TOKEN_COOKIE_NAME) private refreshTokenCookieName: string,
    private userService: UserService
  ) {}

  @ApiOperation({
    summary:
      'Exchange an auth code emitted by the login process for a JWT and refresh token (set via cookies)',
    tags: ['Auth'],
  })
  @Get('/')
  async getAuthCode(
    @Param('authCode') authCode: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const jwt = this.authService.getJwtForAuthCode(authCode);
    if (!jwt) {
      res.status(404);
      res.send({ error: 'Invalid code' });
      return;
    }
    // Put the user's channel name in the result so it can be used for default channel, etc, in clients.
    const decodedJwt: jsonwebtoken.JwtPayload & UserJwt = jsonwebtoken.decode(
      jwt
    ) as jsonwebtoken.JwtPayload & UserJwt;

    res.cookie(this.jwtCookieName, jwt);
    res.cookie(
      this.refreshTokenCookieName,
      this.authService.generateRefreshToken(
        await this.userService.getUser(parseInt(decodedJwt.sub))
      )
    );

    res.send({ status: 'OK', username: decodedJwt.username });
  }
}

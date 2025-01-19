import {
  Controller,
  Get,
  Inject,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  JWT_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../../../injection-tokens';
import { AuthService } from '../services/auth.service';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthValidateDto } from '../../api/dto/auth-validate.dto';

class RefreshTokenResponse {
  @ApiProperty({ example: 'OK' })
  status: string;
  @ApiProperty({ example: 'steglasaurous' })
  username: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(REFRESH_TOKEN_COOKIE_NAME) private refreshTokenCookieName: string,
    @Inject(JWT_COOKIE_NAME) private jwtCookieName: string,
    private authService: AuthService
  ) {}

  @ApiOperation({
    summary: 'Exchange refresh token for a new JWT',
    description:
      'Requires a valid refresh token in a cookie named jwt_refresh. On success, a new JWT and refresh token are both issued as cookies in the response',
    tags: ['Auth'],
  })
  @ApiCookieAuth('jwt_refresh')
  @ApiOkResponse({
    type: RefreshTokenResponse,
  })
  @ApiUnauthorizedResponse({
    description:
      'If the refresh token is not present, invalid or expired.  Client should redirect to /auth/twitch to login again.',
  })
  @Get('refresh')
  async refreshJwt(@Req() request: Request, @Res() response: Response) {
    if (!request.cookies[this.refreshTokenCookieName]) {
      // No refresh token. Return a 401.
      throw new UnauthorizedException();
    }

    const token = await this.authService.getRefreshToken(
      request.cookies[this.refreshTokenCookieName]
    );
    if (token === null) {
      // Token is invalid.
      throw new UnauthorizedException();
    }

    if (token.expiresOn.getTime() < Date.now()) {
      // This token has expired. Deny after invalidating the token in the database.
      await this.authService.invalidateRefreshToken(token.token);
      throw new UnauthorizedException();
    }

    // We got a valid token.  Invalidate it, and issue a new jwt and refresh token.
    await this.authService.invalidateRefreshToken(token.token);
    const newRefreshToken = await this.authService.generateRefreshToken(
      token.user
    );
    const newAccessToken = this.authService.getJwt(token.user);

    response.cookie(this.jwtCookieName, newAccessToken);
    response.cookie(this.refreshTokenCookieName, newRefreshToken, {
      path: '/auth/refresh',
    });

    response.send({ status: 'OK', username: token.user.username });
  }

  @ApiOperation({
    summary: 'Validates the JWT in the request is valid.',
    tags: ['Auth'],
  })
  @ApiOkResponse({
    type: AuthValidateDto,
    example: '{ "status": "OK" }',
  })
  @ApiResponse({
    status: 401,
    description: 'If the JWT is not present, invalid or expired',
  })
  @ApiCookieAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validate(@Req() request: Request) {
    return { status: 'OK', username: request['user'].username };
  }

  @ApiOperation({
    summary: 'Logs a user out by clearing the jwt and refresh cookies',
    tags: ['Auth'],
  })
  @ApiResponse({
    status: 204,
    description: 'When logout is successful, or user is not logged in',
  })
  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.jwtCookieName);
    response.clearCookie(this.refreshTokenCookieName);
    response.statusCode = 204;

    // FIXME: This does not clear the refresh token from the database, as the cookie will only be sent
    // to the refresh endpoint right now.  I may need to create a separate auth subdomain that the cookie
    // is assigned to so it's handled properly. ( I don't want to delete all refresh tokens for the user in case they're
    // logged in elsewhere)
    return;
  }
}

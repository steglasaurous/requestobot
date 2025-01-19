import { Controller, Get, Res, Inject, Query, Logger } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';

import {
  BASE_URL,
  JWT_COOKIE_NAME,
  JWT_EXPIRE_TIME,
  REFRESH_TOKEN_COOKIE_NAME,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
} from '../../../injection-tokens';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../data-store/services/user.service';
import { AuthSource } from '../../data-store/entities/user-auth-source.entity';
import {
  ApiOperation,
  ApiParam,
  ApiTemporaryRedirectResponse,
} from '@nestjs/swagger';

@Controller('auth/twitch')
export class TwitchAuthController {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    private authService: AuthService,
    @Inject(JWT_COOKIE_NAME) private jwtCookieName: string,
    @Inject(JWT_EXPIRE_TIME) private jwtExpireTime: string,
    @Inject(TWITCH_CLIENT_ID) private twitchClientId: string,
    @Inject(TWITCH_CLIENT_SECRET) private twitchClientSecret: string,
    @Inject(BASE_URL) private baseUrl: string,
    @Inject(REFRESH_TOKEN_COOKIE_NAME) private refreshTokenCookieName: string,
    private readonly httpService: HttpService,
    private userService: UserService
  ) {}

  @ApiOperation({
    summary: 'Start the Twitch authentication process',
    tags: ['Auth'],
  })
  @ApiParam({ name: 'mode', enum: [] }) // FIXME: CONTINUE HERE
  @ApiTemporaryRedirectResponse({
    description:
      'Redirects to twitch attaching a generated state value that is used in the return redirect from twitch',
  })
  @Get('/')
  authTwitchStart(@Query('mode') mode: string, @Res() res: Response) {
    const stateKeyValues = new Map<string, string>();
    if (mode) {
      stateKeyValues.set('mode', mode);
    }
    const stateValue = this.authService.generateStateValue();

    this.authService.storeState(stateValue, stateKeyValues);

    const url = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${this.twitchClientId}&redirect_uri=${this.baseUrl}/auth/twitch/return&state=${stateValue}`;

    res.redirect(url);
  }

  @ApiOperation({
    summary:
      'Endpoint where twitch authentication returns to with verification info',
    tags: ['Auth'],
  })
  @ApiParam({
    name: 'code',
    description:
      'auth code returned from twitch to resolve into an OAuth token',
  })
  @ApiParam({ name: 'scope', description: 'twitch scope' })
  @ApiParam({
    name: 'state',
    description:
      'state value as passed from /auth/twitch to verify it is a valid login flow',
  })
  @Get('/return')
  async authTwitchReturn(
    @Query('code') code: string,
    @Query('scope') scope: string,
    @Query('state')
    state: string,
    @Res({ passthrough: true }) response: Response
  ) {
    // FIXME: THis has ZERO error handling.  Need to add handling for:
    // - Error returned from twitch (user didn't authorize, redirect was incorrect, etc.)
    // - Code exchange failed
    // - API call to get user information failed.

    const stateKeyValues = this.authService.getState(state);
    if (!stateKeyValues) {
      // Invalid state - run them through authentication again.
      this.logger.debug(
        'Twitch auth failed: State value was not found in stateMap',
        { state: state, code: code, scope: scope }
      );
      response.redirect('/auth/twitch');
      return;
    }

    // Send server-server request to get actual oauth token.
    const oauthCodeResponse = await firstValueFrom(
      this.httpService.post('https://id.twitch.tv/oauth2/token', {
        client_id: this.twitchClientId,
        client_secret: this.twitchClientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${this.baseUrl}/auth/twitch/return`,
      })
    );
    // FIXME: Add error handling if request failed, or code was invalid

    const tokenData = oauthCodeResponse.data;

    // Now use the token I got to get info about the user.
    const userInfo = await firstValueFrom(
      this.httpService.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: 'Bearer ' + tokenData.access_token,
          'Client-Id': this.twitchClientId,
        },
      })
    );
    // FIXME: Add error handling if API request failed.

    const user = await this.userService.loginUser(
      AuthSource.TWITCH,
      userInfo.data.data[0].id,
      userInfo.data.data[0].login,
      userInfo.data.data[0]
    );

    const authCode = this.authService.generateAuthCode();
    const jwt = this.authService.getJwt(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    this.authService.storeAuthCodeJwt(authCode, jwt);
    response.cookie(this.jwtCookieName, jwt);
    response.cookie(this.refreshTokenCookieName, refreshToken, {
      path: '/auth/refresh',
    });

    if (stateKeyValues.has('mode')) {
      switch (stateKeyValues.get('mode')) {
        case 'authcode':
          // Return an auth code in the result that any client can use to get
          // a JWT.
          response.send('Paste this code into the client app: ' + authCode);
          return;
      }
    }

    // Assume it's an electron app and we redirect to the app url
    response.redirect(`requestobot://?authCode=${authCode}`);

    return;
  }
}

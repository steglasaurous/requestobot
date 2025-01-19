import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { Inject, Injectable } from '@nestjs/common';
import { BASE_URL, STEAM_APIKEY } from '../../../injection-tokens';
import { UserService } from '../../data-store/services/user.service';
import { AuthSource } from '../../data-store/entities/user-auth-source.entity';

// @Injectable()
// export class SteamAuthStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private userService: UserService,
//     @Inject(STEAM_APIKEY) steamApiKey: string,
//     @Inject(BASE_URL) baseUrl: string,
//   ) {
//     super({
//       returnURL: baseUrl + '/auth/steam/return',
//       realm: baseUrl,
//       apiKey: steamApiKey, // FIXME: Put API key here from config.
//     });
//   }
//
//   // Called upon successful validation - we use this to 'register' this user with our db.
//   async validate(identifier: string, profile: any) {
//     console.log('identifier', identifier);
//     console.log('profile', profile);
//
//     return await this.userService.loginUser(
//       AuthSource.STEAM,
//       identifier,
//       profile.displayName,
//       profile,
//     );
//   }
// }

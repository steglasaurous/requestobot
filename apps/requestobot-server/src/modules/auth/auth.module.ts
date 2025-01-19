import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AUTH_CODE_EXPIRE_TIME_MS,
  BASE_URL,
  JWT_COOKIE_NAME,
  JWT_EXPIRE_TIME,
  JWT_SECRET,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_SECRET,
  STATE_VALUE_EXPIRE_TIME_MS,
  STEAM_APIKEY,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
} from '../../injection-tokens';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DataStoreModule } from '../data-store/data-store.module';
import { TwitchAuthController } from './controllers/twitch-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthCodeController } from './controllers/auth-code.controller';

@Module({
  imports: [
    DataStoreModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // FIXME: Should use JWT_SECRET and JWT_EXPIRE_TIME from injection, but apparently I can't use @Inject() in this context.
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule.register({}),
  ],
  providers: [
    AuthService,
    // SteamAuthStrategy,
    JwtStrategy,
    {
      provide: STEAM_APIKEY,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('STEAM_APIKEY');
      },
    },
    {
      provide: BASE_URL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('BASE_URL');
      },
    },
    {
      provide: JWT_SECRET,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('JWT_SECRET');
      },
    },
    {
      provide: JWT_COOKIE_NAME,
      useValue: 'jwt',
    },
    {
      provide: JWT_EXPIRE_TIME,
      useValue: '8h',
    },
    {
      provide: REFRESH_TOKEN_SECRET,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('REFRESH_TOKEN_SECRET');
      },
    },
    {
      provide: REFRESH_TOKEN_COOKIE_NAME,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('REFRESH_TOKEN_COOKIE_NAME');
      },
    },
    {
      provide: REFRESH_TOKEN_EXPIRE_TIME,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<number>('REFRESH_TOKEN_EXPIRE_TIME');
      },
    },
    {
      provide: TWITCH_CLIENT_ID,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('TWITCH_APP_CLIENT_ID');
      },
    },
    {
      provide: TWITCH_CLIENT_SECRET,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('TWITCH_APP_CLIENT_SECRET');
      },
    },
    {
      provide: AUTH_CODE_EXPIRE_TIME_MS,
      useValue: 300000,
    },
    {
      provide: STATE_VALUE_EXPIRE_TIME_MS,
      useValue: 300000,
    },
  ],
  controllers: [AuthController, TwitchAuthController, AuthCodeController],
  exports: [AuthService, JWT_COOKIE_NAME],
})
export class AuthModule {}

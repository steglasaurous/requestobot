import { Test, TestingModule } from '@nestjs/testing';
import { TwitchAuthController } from './twitch-auth.controller';
import { getGenericNestMock } from '../../../../test/helpers';
import {
  BASE_URL,
  JWT_COOKIE_NAME,
  JWT_EXPIRE_TIME,
  REFRESH_TOKEN_COOKIE_NAME,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
} from '../../../injection-tokens';

describe('TwitchAuthController', () => {
  let controller: TwitchAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitchAuthController],
    })
      .useMocker((token) => {
        switch (token) {
          case JWT_COOKIE_NAME:
          case JWT_EXPIRE_TIME:
          case TWITCH_CLIENT_ID:
          case TWITCH_CLIENT_SECRET:
          case BASE_URL:
          case REFRESH_TOKEN_COOKIE_NAME:
            return token;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    controller = module.get<TwitchAuthController>(TwitchAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

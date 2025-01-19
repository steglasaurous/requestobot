import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { getGenericNestMock } from '../../../../test/helpers';
import {
  JWT_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../../../injection-tokens';

describe('AuthController', () => {
  let controller: AuthController;
  const refreshTokenCookieName = 'refreshCookie';
  const jwtCookieName = 'jwtCookieName';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        switch (token) {
          case REFRESH_TOKEN_COOKIE_NAME:
            return refreshTokenCookieName;
          case JWT_COOKIE_NAME:
            return jwtCookieName;
        }
        return getGenericNestMock(token);
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

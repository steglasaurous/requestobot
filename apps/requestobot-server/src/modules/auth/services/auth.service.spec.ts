import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../data-store/entities/user.entity';
import { getGenericNestMock } from '../../../../test/helpers';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRefreshToken } from '../../data-store/entities/user-refresh-token.entity';
import {
  AUTH_CODE_EXPIRE_TIME_MS,
  REFRESH_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_SECRET,
  STATE_VALUE_EXPIRE_TIME_MS,
} from '../../../injection-tokens';

describe('AuthService', () => {
  let service: AuthService;
  let jwtServiceMock;
  const userRefreshTokenRepository = {
    save: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
  };

  const refreshTokenSecret = 'refreshSecret';
  const refreshTokenExpireTime = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        switch (token) {
          case getRepositoryToken(UserRefreshToken):
            return userRefreshTokenRepository;
          case REFRESH_TOKEN_SECRET:
            return refreshTokenSecret;
          case REFRESH_TOKEN_EXPIRE_TIME:
            return refreshTokenExpireTime;
          case AUTH_CODE_EXPIRE_TIME_MS:
            return 500;
          case STATE_VALUE_EXPIRE_TIME_MS:
            return 500;
        }

        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    jwtServiceMock =
      module.get<jest.MockedClass<typeof JwtService>>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a state value', () => {
    expect(service.generateStateValue()).toHaveLength(40);
  });

  it('should store a key-value map for a given state value with a timestamp', () => {
    service.storeState(
      'x',
      new Map<string, string>([['testKey', 'testValue']])
    );

    const actualState = service.getState('x', false);
    const now = Date.now();
    expect(actualState).toBeInstanceOf(Map);
    expect(actualState.get('testKey')).toEqual('testValue');
    expect(parseInt(actualState.get('timestamp'))).toBeLessThanOrEqual(now);
  });

  it('should return key-values for a state and invalidate it', () => {
    const now = Date.now();

    service.storeState(
      'x',
      new Map<string, string>([['testKey', 'testValue']])
    );

    const actualState = service.getState('x', true);
    expect(actualState).toBeInstanceOf(Map);
    expect(actualState.get('testKey')).toEqual('testValue');
    expect(parseInt(actualState.get('timestamp'))).toBeLessThanOrEqual(now);

    const actualEmptyState = service.getState('x');
    expect(actualEmptyState).toBeUndefined();
  });

  it('should return undefined if the state value does not exist', () => {
    const actualEmptyState = service.getState('x');
    expect(actualEmptyState).toBeUndefined();
  });

  it('should generate an auth code value', () => {
    expect(service.generateAuthCode()).toHaveLength(32);
  });

  it('should store a jwt with an auth code, and delete it upon retrieval', () => {
    service.storeAuthCodeJwt('authcode', 'jwt');
    const actual = service.getJwtForAuthCode('authcode');
    expect(actual).toEqual('jwt');
    expect(service.getJwtForAuthCode('authcode')).toBeUndefined();
  });

  it('should return a JWT for a valid user object', () => {
    const user = new User();
    user.id = 1;
    user.username = 'testuser1';
    user.displayName = 'testuser1-displayname';

    jwtServiceMock.sign.mockImplementation(() => 'TESTJWT');

    const result = service.getJwt(user);

    expect(result).toBe('TESTJWT');
    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      username: user.username,
      displayName: user.displayName,
      sub: user.id,
    });
  });

  it('should verify a valid jwt token', () => {
    jwtServiceMock.verify.mockReturnValue({});
    const actual = service.verifyJwt('jwt');
    expect(actual).toEqual({});
    expect(jwtServiceMock.verify).toHaveBeenCalledWith('jwt');
  });

  it('should generate a refresh token for a user', async () => {
    const user = new User();
    user.id = 1;
    user.username = 'testuser1';
    user.displayName = 'testuser1-displayname';

    const actual = await service.generateRefreshToken(user);
    const expectedExpiresOn =
      Date.now() + refreshTokenExpireTime * 24 * 60 * 60 * 1000;
    expect(actual).toHaveLength(64);
    expect(userRefreshTokenRepository.save.mock.calls[0][0]).toEqual({
      user: user,
      token: expect.any(String),
      expiresOn: expect.any(Date),
    });
    expect(
      userRefreshTokenRepository.save.mock.calls[0][0].expiresOn.getTime()
    ).toBeLessThanOrEqual(expectedExpiresOn);
  });

  it('should get a refresh token', async () => {
    const expectedUserRefreshToken = new UserRefreshToken();
    expectedUserRefreshToken.id = 123;

    userRefreshTokenRepository.findOneBy.mockReturnValue(
      Promise.resolve(expectedUserRefreshToken)
    );

    const actual = await service.getRefreshToken('token');
    expect(userRefreshTokenRepository.findOneBy).toHaveBeenCalledWith({
      token: 'token',
    });

    expect(actual).toEqual(expectedUserRefreshToken);
  });

  it('should invalidate a refresh token', async () => {
    await service.invalidateRefreshToken('x');
    expect(userRefreshTokenRepository.delete).toHaveBeenCalledWith({
      token: 'x',
    });
  });

  it('should remove any auth codes that have expired', (done) => {
    service.storeAuthCodeJwt('x', 'jwt');

    setTimeout(() => {
      service.storeAuthCodeJwt('y', 'jwt2');
      service.cleanAuthCodes();
      expect(service.getJwtForAuthCode('x')).toBeUndefined();
      expect(service.getJwtForAuthCode('y')).toEqual('jwt2');
      done();
    }, 600);
  });

  it('should remove any state values that have expired', (done) => {
    service.storeState('x', new Map<string, string>());

    setTimeout(() => {
      service.storeState('y', new Map<string, string>());
      service.cleanStateMap();
      expect(service.getState('x')).toBeUndefined();
      expect(service.getState('y')).toBeDefined();
      done();
    }, 600);
  });
});

// Helper functions for unit tests.  Put utilities here that will be available globally
// in specs.
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { Channel } from '../src/modules/data-store/entities/channel.entity';
import { I18nService } from 'nestjs-i18n';
import { Game } from '../src/modules/data-store/entities/game.entity';
import { AbstractChatClient } from '@steglasaurous/chat';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ChatMessage } from '@steglasaurous/chat';
import { Song } from '../src/modules/data-store/entities/song.entity';
import { SongRequest } from '../src/modules/data-store/entities/song-request.entity';
import { exec } from 'child-process-promise';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { TestInternalChatClient } from '@steglasaurous/chat';

// NOTE: Importing this with '*' here INSTEAD of how it's done in main.ts as import cookieParser from 'cookie-parser'
// Otherwise, the app complains it's not a function.
// Details: https://stackoverflow.com/questions/51616419/nestjs-cookie-parser-is-not-a-function-error-during-e2e-test
// import * as cookieParser from 'cookie-parser';
// UPDATE: Apparently this fixed itself?  Seems to work this way now in this repo.
import cookieParser from 'cookie-parser';

export const getGenericNestMock = (token) => {
  if (token == I18nService) {
    return getMockI18nService();
  }

  const moduleMocker = new ModuleMocker(global);

  // if (token == WINSTON_MODULE_PROVIDER) {
  //   return {
  //     info: jest.fn(),
  //     notice: jest.fn(),
  //     warn: jest.fn(),
  //     warning: jest.fn(),
  //     error: jest.fn(),
  //     alert: jest.fn(),
  //     emerg: jest.fn(),
  //     debug: jest.fn(),
  //   };
  // }
  const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<
    any,
    any
  >;
  const Mock = moduleMocker.generateFromMetadata(mockMetadata);
  try {
    return new Mock();
  } catch (err: any) {
    console.log(`Cannot create token ${token}`, err);
    // throw err;
  }
};

// So technically this is all that's required to make this function globally available in tests without
// having to import it specifically, however typescript in IDEs will complain it's not defined.
// For now, we do both - export the function AND define it in globals.  If there's a
// better way to deal with this, please do modify.
global.getGenericNestMock = getGenericNestMock;

export const getMockChannel = (): Channel => {
  const game = new Game();
  game.id = 1;
  game.name = 'spin';

  const channel = new Channel();
  channel.enabled = true;
  channel.queueOpen = true;
  channel.channelName = 'testchannel';
  channel.game = game;
  channel.lang = 'en';

  return channel;
};
export const getMockChatMessage = (): ChatMessage => {
  return {
    channelName: 'testchannel',
    chatServiceName: 'twitch',
    client: {
      sendMessage: jest.fn(),
      leaveChannel: jest.fn(),
      joinChannel: jest.fn(),
    } as unknown as AbstractChatClient,
    message: '!req somesong',
    id: '1',
    date: new Date(),
    color: '',
    emotes: new Map<string, string[]>(),
    userIsBroadcaster: false,
    userIsMod: false,
    userIsSubscriber: false,
    userIsVip: false,
    username: 'testuser',
  } as ChatMessage;
};

export const getMockI18nService = (): any => {
  const mock = {
    t: jest.fn(),
  };
  mock.t.mockImplementation((key: string) => {
    return key;
  });

  return mock;
};

export const getSampleSong = (songNumber = 1): Song => {
  const song = new Song();
  song.id = songNumber;
  song.title = 'title_' + songNumber;
  song.artist = 'artist_' + songNumber;
  song.mapper = 'mapper_' + songNumber;

  return song;
};

export const getSampleSongRequests = (count: number): SongRequest[] => {
  const output: SongRequest[] = [];

  for (let i = 0; i < count; i++) {
    const songRequest = new SongRequest();
    songRequest.requestOrder = i;
    songRequest.song = getSampleSong(i + 1);

    output.push(songRequest);
  }

  return output;
};

export const setupDatabaseFixtures = async () => {
  // Reset the database
  await exec(
    'npx ts-node ./node_modules/typeorm/cli schema:drop -d ./src/typeorm-cli.config.ts'
  );
  await exec(
    'npx ts-node ./node_modules/typeorm/cli migration:run -d ./src/typeorm-cli.config.ts'
  );

  // Load fixtures
  await exec(
    'npx fixtures-ts-node-commonjs load -d src/typeorm-cli.config.ts fixtures'
  );
};

export const createNestApp = async () => {
  const chatClient = new TestInternalChatClient();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider('ChatClients')
    .useValue([chatClient])
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    credentials: true,
    // origin: '*',
    origin: 'http://localhost:4200',
  });
  // NOTE: Even though the IDE complains about this, it actually compiles without issue.  See note on import cookie-parser above.
  app.use(cookieParser());
  return app;
};

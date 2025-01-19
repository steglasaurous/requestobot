import { INestApplication } from '@nestjs/common';
import { TestInternalChatClient } from '../../src/modules/chat/services/clients/test-internal-chat-client.service';
import {
  createNestApp,
  getMockChatMessage,
  setupDatabaseFixtures,
} from '../helpers';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let chatClient: TestInternalChatClient;

  beforeAll(async () => {
    await setupDatabaseFixtures();
  }, 30000);

  beforeEach(async () => {
    app = await createNestApp();
    await app.init();
    chatClient = app.get('ChatClients')[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('should insert requests using oneperuser queue strategy', async () => {
    // As channelactive, set the queue strategy to oneperuser
    // const rbSetMessage = getMockChatMessage();
    const rbSetMessage = {
      ...getMockChatMessage(),
      message: '!rbset queuestrategy oneperuser',
      userIsBroadcaster: true,
      username: 'channelactive',
      channelName: 'channelactive',
      client: chatClient,
    };

    const rbSetResponse = await chatClient.emitReceivedMessageAndAwaitResponse(
      rbSetMessage
    );

    expect(rbSetResponse.message).toEqual('! queuestrategy set to oneperuser.');

    // As user1, make a request
    const user1Request1Response =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!req Addicted To A Memory',
        username: 'user1',
        channelName: 'channelactive',
        client: chatClient,
      });

    expect(user1Request1Response.message).toEqual(
      '! Addicted To A Memory - Zedd (OST) added to the queue.'
    );

    // As user2, make a request
    const user2Request1Response =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!req Anemone',
        username: 'user2',
        channelName: 'channelactive',
        client: chatClient,
      });

    expect(user2Request1Response.message).toEqual(
      '! Anemone - Naden (OST) added to the queue.'
    );

    // As user3, make a request
    const user3Request1Response =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!req Bangarang',
        username: 'user3',
        channelName: 'channelactive',
        client: chatClient,
      });

    expect(user3Request1Response.message).toEqual(
      '! Bangarang - Skrillex (OST) added to the queue.'
    );
    // Verify everyone's in the same priority
    const queueResponse1 = await chatClient.emitReceivedMessageAndAwaitResponse(
      {
        ...getMockChatMessage(),
        message: '!queue',
        username: 'user1',
        channelName: 'channelactive',
        client: chatClient,
      }
    );

    expect(queueResponse1.message).toEqual(
      '! #1 Addicted To A Memory - Zedd (OST) #2 Anemone - Naden (OST) #3 Bangarang - Skrillex (OST) '
    );

    // As user1, make a 2nd request
    const user1Request2Response =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!req Drift',
        username: 'user1',
        channelName: 'channelactive',
        client: chatClient,
      });

    expect(user1Request2Response.message).toEqual(
      '! Drift - Rafael Frost (OST) added to the queue.'
    );

    // As user1, make a 3rd request
    const user1Request3Response =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!req Freedom',
        username: 'user1',
        channelName: 'channelactive',
        client: chatClient,
      });

    expect(user1Request3Response.message).toEqual(
      '! Freedom - The Originals (OST) added to the queue.'
    );

    // As user2, make a 2nd request
    const user2Request2Response =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!req Gangnam Style',
        username: 'user2',
        channelName: 'channelactive',
        client: chatClient,
      });

    expect(user2Request2Response.message).toEqual(
      '! Gangnam Style - PSY (OST) added to the queue.'
    );

    // Verify user2's request appears at the end of priority 1
    const queueResponse2 = await chatClient.emitReceivedMessageAndAwaitResponse(
      {
        ...getMockChatMessage(),
        message: '!queue',
        username: 'user1',
        channelName: 'channelactive',
        client: chatClient,
      }
    );

    expect(queueResponse2.message).toEqual(
      '! #1 Addicted To A Memory - Zedd (OST) #2 Anemone - Naden (OST) #3 Bangarang - Skrillex (OST) #4 Drift - Rafael Frost (OST) #5 Gangnam Style - PSY (OST) and 1 more.'
    );

    // Do next song to advance the queue
    // Do this twice as the first one will make the first song active, then the next call
    // will actually advance the queue.
    const nextSongResponse1 =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!nextsong',
        username: 'channelactive',
        channelName: 'channelactive',
        userIsBroadcaster: true,
        client: chatClient,
      });
    const nextSongResponse2 =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!nextsong',
        username: 'channelactive',
        channelName: 'channelactive',
        userIsBroadcaster: true,
        client: chatClient,
      });

    // Have a completely new user make a request
    const user4Request1Response =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!req Hit the Beat',
        username: 'user4',
        channelName: 'channelactive',
        client: chatClient,
      });

    expect(user4Request1Response.message).toEqual(
      '! Hit the Beat - IamDayLight (OST) added to the queue.'
    );

    // Verify the queue order is correct.
    const queueResponse3 = await chatClient.emitReceivedMessageAndAwaitResponse(
      {
        ...getMockChatMessage(),
        message: '!queue',
        username: 'user1',
        channelName: 'channelactive',
        client: chatClient,
      }
    );

    expect(queueResponse3.message).toEqual(
      '! #1 Anemone - Naden (OST) #2 Bangarang - Skrillex (OST) #3 Hit the Beat - IamDayLight (OST) #4 Drift - Rafael Frost (OST) #5 Gangnam Style - PSY (OST) and 1 more.'
    );

    const nextSongResponse3 =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!nextsong',
        username: 'channelactive',
        channelName: 'channelactive',
        userIsBroadcaster: true,
        client: chatClient,
      });
    const nextSongResponse4 =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!nextsong',
        username: 'channelactive',
        channelName: 'channelactive',
        userIsBroadcaster: true,
        client: chatClient,
      });
    const nextSongResponse5 =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!nextsong',
        username: 'channelactive',
        channelName: 'channelactive',
        userIsBroadcaster: true,
        client: chatClient,
      });

    // Brand new user makes a request.
    const user5Request1Response =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!req Golden Pineapple',
        username: 'user5',
        channelName: 'channelactive',
        client: chatClient,
      });

    expect(user5Request1Response.message).toEqual(
      '! Golden Pineapple - Tolan (OST) added to the queue.'
    );

    const nextSongResponse6 =
      await chatClient.emitReceivedMessageAndAwaitResponse({
        ...getMockChatMessage(),
        message: '!nextsong',
        username: 'channelactive',
        channelName: 'channelactive',
        userIsBroadcaster: true,
        client: chatClient,
      });

    const queueResponse4 = await chatClient.emitReceivedMessageAndAwaitResponse(
      {
        ...getMockChatMessage(),
        message: '!queue',
        username: 'user1',
        channelName: 'channelactive',
        client: chatClient,
      }
    );
    expect(queueResponse4.message).toEqual(
      '! #1 Golden Pineapple - Tolan (OST) #2 Gangnam Style - PSY (OST) #3 Freedom - The Originals (OST) '
    );
  }, 30000);
});

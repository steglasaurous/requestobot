import { WebSocketServer } from 'ws';
import { Subject } from 'rxjs';

export interface ReceivedChatMessage {
  event: string;
  data: any;
}

/*
 * NOTE: I tried having this server live in util-chat, however I couldn't get the jest global-setup.ts to import from
 * @steglasaurous/chat with the error:
 *
 * Jest: Got error running globalSetup - /home/steg/PersonalCode/requestobot/apps/requestobot-server-e2e/src/support/global-setup.ts, reason: Cannot find module '@steglasaurous/chat'
 *
 * Trying to define module paths, reading tsconfig into jest config, nothing seemed to resolve it.  So I moved it back
 * here so at least the tests work.  Obviously this interface will need to morph is the interface in util-chat changes, which
 * is not ideal, but until I can resolve the above problem, I'm stuck with this.
 */
export interface BaseChatMessage {
  id: string;
  username: string;
  channelName: string;
  message: string;
  emotes: Map<string, string[]>;
  date: Date;
  color: string;
  userIsMod: boolean;
  userIsBroadcaster: boolean;
  userIsVip: boolean;
  userIsSubscriber: boolean;
}

export class TestChatServer {
  private wss!: WebSocketServer;
  private receivedMessages: ReceivedChatMessage[] = [];
  private receivedMessagesSubject: Subject<ReceivedChatMessage> =
    new Subject<ReceivedChatMessage>();
  public readonly receivedMessages$ =
    this.receivedMessagesSubject.asObservable();

  start(port = 3030) {
    this.wss = new WebSocketServer({ port: port });
    this.wss.on('connection', (ws) => {
      console.log('Test server connection opened');
      ws.on('error', (err) => {
        console.error('Received error from websocket connection', err);
      });
      ws.on('message', (message) => {
        console.log('Test server received message', message.toString());
        this.wss.clients.forEach((client) => {
          if (client !== ws) {
            console.log('Sending message to client');
            client.send(message);
          }
        });
        const parsedMessage = JSON.parse(message.toString());
        this.receivedMessages.push(parsedMessage);
        this.receivedMessagesSubject.next(parsedMessage);
      });
    });
  }

  stop() {}
  sendMessage(data: BaseChatMessage) {
    this.wss.clients.forEach((client) => {
      client.send(JSON.stringify({ event: 'message', data: data }));
    });
  }

  getReceivedMessages(): ReceivedChatMessage[] {
    return this.receivedMessages;
  }

  clearReceivedMessages(): void {
    this.receivedMessages = [];
  }
}

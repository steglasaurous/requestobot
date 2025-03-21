import { Observable } from 'rxjs';
import { ChatMessage } from '../chat-message';
import { ChatServiceName } from '../chat-service-name.enum';

export abstract class AbstractChatClient {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract joinChannel(channelName: string): Promise<void>;
  abstract leaveChannel(channelName: string): Promise<void>;
  abstract messages$: Observable<ChatMessage>;
  abstract sendMessage(channelName: string, message: string): Promise<void>;
  abstract readonly chatServiceName: ChatServiceName;
}

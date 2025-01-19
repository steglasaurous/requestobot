import { ChatMessage } from '../services/chat-message';

export class ChatMessageReceiveEvent {
  constructor(public chatMessage: ChatMessage) {}
}

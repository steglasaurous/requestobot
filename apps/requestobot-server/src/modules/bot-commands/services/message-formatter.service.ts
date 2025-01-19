import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageFormatterService {
  constructor() {}

  formatMessage(message): string {
    // For the moment, we prefix all messages with an ! to avoid triggering TTS reading what the bot says every time.
    // This may change to be a per-channel customization if some channels would prefer it to be read or otherwise don't
    // want the prefix.  Gives us an extension point should we need it.
    return '! ' + message;
  }
}

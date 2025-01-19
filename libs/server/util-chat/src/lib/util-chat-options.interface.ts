export interface UtilChatOptions {
  twitchConfig?: {
    clientId: string;
    clientSecret: string;
    twitchTokenFile: string;
    twitchChannel: string;
  };
  testClient?: {
    url: string;
  };
}

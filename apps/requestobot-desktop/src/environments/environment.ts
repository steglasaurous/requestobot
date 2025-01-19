declare const __BUILD_VERSION__: string;

export const environment = {
  production: false,
  version: __BUILD_VERSION__,
  queuebotApiBaseUrl: 'http://localhost:4000',
  websocketUrl: 'ws://localhost:4000',
};

import { TestChatServer } from './support/test-chat-server';

console.log('Starting test chat server');
const testChatServer = new TestChatServer();
testChatServer.start();
console.log('test chat server running');

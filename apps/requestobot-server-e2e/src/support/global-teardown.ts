/* eslint-disable */

import { execSync } from 'child_process';

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  console.log('Stopping requestobot server');
  globalThis.serverInstance.kill();

  console.log('Stopping test chat server');
  globalThis.testChatServer.stop();

  console.log('Stopping database server');
  console.log(execSync('docker compose down'));
};

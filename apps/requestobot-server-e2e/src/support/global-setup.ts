import { exec, execSync } from 'child_process';
import { TestChatServer } from './test-chat-server';

module.exports = async function () {
  return new Promise<void>((resolve) => {
    console.log('Starting database');
    console.log(execSync('docker compose up -d db').toString());
    console.log('Clearing database');

    console.log(
      execSync(
        'npx ts-node --project ./apps/requestobot-server/tsconfig.app.json ./node_modules/typeorm/cli schema:drop -d ./apps/requestobot-server/src/typeorm-cli.config.ts',
        {}
      ).toString()
    );

    console.log('Running migrations');
    console.log(
      execSync(
        'npx ts-node --project ./apps/requestobot-server/tsconfig.app.json ./node_modules/typeorm/cli migration:run -d ./apps/requestobot-server/src/typeorm-cli.config.ts',
        {}
      ).toString()
    );

    console.log('Loading fixtures');
    console.log(
      execSync(
        'node ./dist/apps/requestobot-server/main.js load-fixtures'
      ).toString()
    );

    console.log('Starting test chat server');
    const testChatServer = new TestChatServer();
    testChatServer.start();
    globalThis.testChatServer = testChatServer;

    console.log('Starting requestobot server');

    // Apparently this only works on linux..  Windows doesn't like this.
    let launchCommand =
      'NODE_ENV=test node dist/apps/requestobot-server/main.js --serve';

    if (process.platform == 'win32') {
      launchCommand =
        'set NODE_ENV=test && node dist/apps/requestobot-server/main.js --serve';
    }

    console.log(launchCommand);

    globalThis.serverInstance = exec(launchCommand);
    // FIXME: Add a timeout to abort if we don't see this successfully start on time.
    globalThis.serverInstance.stdout.on('data', (data) => {
      console.log(data);
      if (data.includes('Nest application successfully started')) {
        console.log('**** nest app started! ****');
        resolve();
      }
    });
  });
};

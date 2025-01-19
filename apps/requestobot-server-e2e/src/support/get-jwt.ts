import { execSync } from 'child_process';

export const getJwt = (
  channelName: string,
  authSourceUserId?: string
): string => {
  if (!authSourceUserId) {
    // make up a random one
    authSourceUserId = channelName;
  }

  return execSync(
    `node dist/apps/requestobot-server/main.js generate-jwt "${authSourceUserId}" ${channelName}`
  )
    .toString()
    .trim();
};

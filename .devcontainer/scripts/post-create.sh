#!/usr/bin/env bash
set -euo pipefail

# Named Docker volumes mount as root-owned; postCreate runs as the node user.
sudo mkdir -p /workspaces/requestobot/node_modules
sudo chown -R node:node /workspaces/requestobot/node_modules

npm install
npx nx run-many -t build

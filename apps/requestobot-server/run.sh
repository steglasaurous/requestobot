#!/usr/bin/env bash
envsubst < /opt/queuebot/queuebot/.env.dist > /opt/queuebot/queuebot/.env
cd /opt/queuebot/queuebot && npm run typeorm:run-migrations && npm run start

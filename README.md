Todo:

- [ ] Implement refreshing JWT tokens if they've expired.
  - How to handle this in the client if it shouldn't be able to read its own JWT? 
  - Do a thing where if an access denied happens on an API endpoint, and a refresh token is present in local storage (or setting storage), 
  - go through a refresh process, then if successful, re-send the API request with the new token.

- [ ] Electron app: Port over existing electron app into new one here, get functional to "at least" where I left off.
  - [x] Add login event(s) (needs testing when installed)
- 
- [ ] If bot has not joined channel, disable all controls, add button to "join channel" - implement server-side ability to join channels and/or create them
- [ ] Add "enable/disable requestobot" button toggle
- [ ] Implement search and adding songs to queue
- [ ] Port original queuebot readme to this readme, update as necessary


# Development

## Setup

1. Copy .env.dist to .env and fill in appropriate values.
2. Populate the twitch_token.json file.  (FIXME: Add details on how to populate this)
3. Run `npm install`
4. Run `nx run-many -t build` to build all apps and libs
5. Start database server via docker-compose: `docker compose up -d db`
6. Start requestobot-server with `nx serve requestobot-server`
7. Start angular client with `nx serve requestobot-client`
8. Start electron app with `nx serve requestobot-desktop`.  Note in this mode the electron app loads the client via the served requestobot-client.  When building the output electron app, it will be embedded in the electron app itself.

# Unit tests

Unit tests are an ongoing saga, but the goal is to have most things covered with tests, if not all.  requestobot-server in particular is of particular
interest as it's the core of everything. 

To run tests in requestobot-server:

```
nx test requestobot-server
```

# E2E Tests

## Requirements

* Docker and docker compose plugin (for spinning up the database)
* node 20.x+ (for running the server itself locally)


## Usage

```bash
nx e2e requestobot-server-e2e --run-in-band
```

Note: The `--run-in-band` flag is to run the tests sequentially rather than in parallel.  This
is to make testing for chat messages easier vs having to scan through all messages to find the
one we're expecting.

- [x] FIXME: NEXT STEP: Create a helper function to get JWTs, and make getting the JWT
result more resilient to extra output like the punycode deprecation warning.
- [ ] FIXME: Move chat module to its own library that nest pulls in so the e2e tests can share some code (and ultimately other projects)

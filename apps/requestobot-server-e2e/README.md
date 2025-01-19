# Running tests

I've noticed on windows the nx cache doesn't seem reliable and causes problems when running tests after the initial compile.

What works for me is: 

```
npx nx reset && npx nx e2e requestobot-server-e2e
```

# Chat Client Websocket server spec

The tests use a test chat client that connects to a websocket server for testing.

The server itself is simply a relay. It'll echo whatever is sent to it to other
connected clients. That's it.  

The clients have the following events:

joinChannel

```json
{
  "event": "joinChannel",
  "data": {
    "channelName": "somechannelname"
  }
}
```

leaveChannel

```json
{
  "event": "leaveChannel",
  "data": {
    "channelName": "somechannelname"
  }
}
```

message (sent from requestobot-server)

```json
{
  "event": "message",
  "data": {
    "channelName": "somechannelname",
    "message": "somemessage"
  }
}
```

message (sent by test client TO requestobot-server)

```json
{
  "event": "message",
  "data": {
    "channelName": "somechannelname",
    "color": "#AAAAAA",
    "emotes": [],
    "id": 123457,
    "message": "somemessage",
    "userIsBroadcaster": true,
    "userIsMod": false,
    "userIsSubscriber": false,
    "userIsVip": false,
    "username": "someuser",
  }
}
```

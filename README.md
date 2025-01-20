# Requestobot

A song request chatbot which manages song requests for streamers playing games that don't have their own built-in
request system.  It has an up-to-date database of song details for OSTs and custom songs for each supported game.

Supported Games:
* Audio Trip
* Spin Rhythm XD
* Pistol Whip
* Dance Dash
* Synth Riders

## Getting Started

1. Goto https://twitch.tv/requestobot, click on "Chat", then type `!join` to have the bot join your channel.
2. Commands and info on how to use the bot are detailed below, as well as on requestobot's about page.  You can find that [here](https://www.twitch.tv/requestobot/about).

## Usage

1. When setting up for a game, use `!setgame` to tell requestobot which game you're playing, so it can search through the
   appropriate songs when getting requests.  For example, to set the game to Spin Rhythm XD:

```
steglasaurous: !setgame spin rhythm xd
requestobot: ! Game changed to Spin Rhythm XD
```

Possible games are: `audio trip`, `spin rhythm xd`, `pistol whip`, `dance dash`, `synth_riders`

2. Your viewers can use `!req` to request songs.  For example:

```
steglasaurous: !req esoteria
requestobot: ! Esoteria by Geoplex (Dama) added to the queue.
```

Using `!req` by itself will show instructions on how to request songs appropriate to the current game. Here's an example
when the game is set to Spin Rhythm XD:

```
steglasaurous: !req
requestobot: ! How to request songs: Goto https://spinsha.re for available songs.  To request, type !req title in chat. You can also request by spinsha.re id like !req 9559 or by URL !req https://spinsha.re/song/9559
```

3. To get the next song that's on the queue, use `!nextsong`.  This will show what the next request is (and by whom), and will advance the queue forward.  Example:

```
steglasaurous: !nextsong
requestobot: ! Esoteria by Geoplex (Dama) requested by @steglasaurous is next!
```

If the queue is empty, the bot will let you know:

```
steglasaurous: !nextsong
requestobot: ! No requests in queue.
```

Note that `!nextsong` can only be used by the broadcaster or moderators.

There are plenty of other commands available - see below for the complete list.

Happy streaming!

## Command List

**!setgame** - Set the game the bot should search requests with.  This would be the game name similar to how you'd see it on Twitch.  Examples: **!setgame audio trip**, **!setgame spin rhythm xd**

**!req** - Add a song request to the queue.  Use the song title to request a song.  If more than one song matches, you will be presented with a list of matches, and can respond with **!req #1** to select the first song, **!req #2** to select the second song, etc.

Also note using **!req** on its own will show instructions on how to request songs, and where to find songs for the current game.

Aliases for `!req` are `!srr`, `!bsr`, `!atr`

**!oops** - Requested the wrong song?  This removes the last song request you made.

**!nextsong** - For broadcaster and mods only.  Takes the next song off the top of the request queue and posts it to chat.  This removes the song from the request queue.

**!queue** - Shows the list of songs in the queue.  If the queue is too long, only the top 5 songs are shown, with a count of how many additional songs there are.

**!clear** - For broadcasters and mods only.  This completely clears the request queue.

**!close** - Close the queue from requests so viewers cannot add new requests to the queue. Note that the broadcaster and mods can still add requests even if it's closed.

**!open** - Open the queue for requests from anyone.

**!requestobot off** - This turns off all commands until you turn them back on with **!requestobot on**.  This is a way of disabling the bot without removing it from your channel.

**!requestobot on** - Enable the bot to respond to commands in your channel.

**!getout** - Broadcaster and mods only. Have requestobot leave your channel.  Once left, commands will not work until you invite the bot into your channel again.

## Feature Requests and Bugs

If you have feature requests, would like to see the bot do something differently, or want to file a bug report, please
use the github issues tab to do so.  Always happy to take feedback.

Although I'll do the best I can to address issues and features, I do this purely on a volunteer basis, so I cannot guarantee
your feature will be implemented, or in a timely fashion.  Also note use of this bot is offered as-is so use at your own risk.

Having said that, I hope it's useful to you! Enjoy!

# Development Details

Everything below here is useful if you want to contribute towards developing the bot yourself.

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

# Todo

# Goal

1. Get working prototype of electron app, send to internal testers

## First

- [x] UI: Request order number - use incrementing number, NOT the actual order number
- [x] Server: Implement banned song list - songs that cannot be queued
- [ ] Overlay: Add highlight of what the current song is
- [ ] UI: Add button to change queue strategy
- [ ] Overlay: Change font/colors
- [ ] UI: Add album art to queue list, if available
- [ ] UI: Implement clear queue button
- [ ] UI: Sketch out how I might clean up the UI / make it look slick
- [ ] Server: Importers: Only report new songs imported, vs total songs
- [ ] Spin rhythm importer: Implement song downloader to read duration and BPM data (or use API?)
- [ ] UI: Implement total queue length display (in mm:ss)
- [ ] UI: Style up game change dialog
- [ ] UI: Change purple buttons to something else
- [ ] UI, API: Dragging a song to position 1 fails to swap it
- [ ] Server: When returning multiple results, if titles or artists make a message too long, it will break the message 
      up into 2 separate messages, without the ! in front on the 2nd message.
- [ ] When removing the active song with remove function, makr the next song as active and emit "up next" message
- [ ] Add !commands to list commands?  Or link to site with details
- [ ] Add handling to allow client to stay logged in over a long period of time.
- [ ] Explore "song ban timeouts" - where a song is banned for a period of time
## Next

- [ ] Server: Implement song-requests POST to create new song request via API
- [ ] Server: Implement songs GET to search for songs
- [ ] UI: Implement add song to queue via search/autocomplete
- [ ] UI: Remove menus from electron interface (for now)
- [ ] Server: Clear out queue when switching games.
- [ ] Server: Implement clearing played history via command
- [ ] UI: Implement showing what's already been played
- [ ] UI: Implement clearing played history (vs clearing queue completely)
- [ ] UI: Implement rollback/undo button to reverse the queue to its previous state
- [ ] `!rbget` - Return a list of requestobot settings for the channel it's in.  Broadcaster and mods only.
- [ ] UI: Figure out how windows package signing works, see if I can do it cheaply
- [ ] Server: Implement missing unit and e2e tests
- [ ] UI: Implement unit tests

## Backlog

- [ ] Server: Implement rollback/undo command to reverse the queue to its previous state
- [ ] Server: !top - Move song to the top of the queue - use title? song position? Or move last added song?
- [ ] Server: !rollback - put the last song that was popped off the queue back on top
- [ ] Server: Add ability to set limits on how many requests can be queued per user, per role, etc.
- [ ] Idea: Allow adding search filters by difficulty, so streamer can limit difficulty level being requested.
- [ ] Implement github action to build & run tests in CI

## Done
- 
- [x] Implement a web client that shows the current queue (usable as an OBS overlay)
- [x] UI: Implement next song button to advance the queue
- [x] Server: Implement song-request PUT to modify a request (setting song as active)
- [x] UI: Implement selecting active song
- [x] Server: Implement change channel settings API
- [x] UI: Implement ability to open or close the queue from interface
- [x] UI: Implement ability to change game from interface
- [x] UI: Implement showing downloaded status of each song (not downloaded, download progress, present locally)
- [x] UI: Create an installable package, test on a new machine
- [x] Deploy server changes to production
- [x] UI: Implement logout
- [x] UI: Implement current game and queue status display
- [x] Implement CSS using tailwind
- [x] Server: Implement remove song from queue command !remove
- [x] Server: Implement remove song from queue API
- [x] Server: Get e2e tests working for API endpoints (cookieParser() not working in test)
- [x] UI: Implement remove song
- [x] Implement auto-reconnect for websocket connections
- [x] Server: Implement queuing strategies - add 'fair queuing' strategy
  - `!rbset queuestrategy oneperuser`
    - Sets queuing to order by one per user at a time.  Ex: if user A makes 2 requests and user B makes 1 request, the order would be: User A request 1, User B request 1, User A request 2
  - `!rbset queuestrategy random`
    - Injects the request in a random spot in the queue when it comes in.
  - `!rbset queuestrategy fifo`
    - "First In, First Out" - queuing based on first-come, first-served.  This is the default.
  - `!rbset queuestrategy default`
    - Sets the queue strategy to the default, which is `fifo`
- [x] Server: Send queue update websocket messages whenever the queue changes
- [x] UI: Update queue state on all update events
- [x] Instead of removing songs from the queue database, mark them as played.  Add cron to remove played songs after 12 hours or so.
- [x] Add concept of "current song" to keep track of what the current song in the queue is.  !nextsong should mark the song as current song. Another !nextsong should remove the current song and put the next song as the 'current song', etc.
- [x] Implement Twitch SSO
- [x] UI Tailwind: Login container: Style form with input textbox, display only when electron isn't available
  - Look at using proper angular form handling along with a custom input component


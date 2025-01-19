import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getJwt } from '../../support/get-jwt';
import WebSocket from 'ws';

describe('Channels controller (e2e)', () => {
  let chatClient: WebSocket;
  let axiosInstance: AxiosInstance;

  beforeAll((done) => {
    axiosInstance = axios.create({
      baseURL: `http://localhost:${process.env.PORT}`,
      withCredentials: true,
      responseType: 'json',
    });

    chatClient = new WebSocket('ws://localhost:3030');
    chatClient.on('open', () => {
      console.log('Chat client connected to test chat server');
      done();
    });
  });

  afterAll(() => {
    chatClient.close();
  });

  it('should create a channel for a broadcaster', async () => {
    const channelName = 'newChannel';
    // Use the generate-jwt command
    const jwt = getJwt(channelName);

    let response: AxiosResponse<any>;

    try {
      response = await axiosInstance.post(
        `/api/channels`,
        {
          channelName: channelName,
          chatServiceName: 'test-external',
          inChannel: true,
          enabled: true,
          queueOpen: true, // and gameDto
        },
        {
          withCredentials: true,
          responseType: 'json',
          headers: {
            Cookie: `jwt=${jwt}`,
          },
        }
      );
    } catch (e) {
      throw new Error(e.message.toString());
    }

    expect(response.status).toBe(201);
    expect(response.data.id).toBeGreaterThan(0);

    // FIXME: Test that the bot joined the channel
  }, 20000);

  it('should not create a channel if the user does not own the channel', async () => {
    const channelName = 'notMyChannel';
    // Use the generate-jwt command
    const jwt = getJwt('someguy');

    let response: AxiosResponse<any>;

    try {
      response = await axiosInstance.post(
        `/api/channels`,
        {
          channelName: channelName,
          chatServiceName: 'test-external',
          inChannel: true,
          enabled: true,
          queueOpen: true, // and gameDto
        },
        {
          withCredentials: true,
          responseType: 'json',
          headers: {
            Cookie: `jwt=${jwt}`,
          },
        }
      );
    } catch (e) {
      expect(e.status).toBe(400);
    }
  });
  it('should not create a channel and return a 422 if the channel already exists', async () => {
    const channelName = 'channelactive';
    const jwt = getJwt('channelactive');

    let response: AxiosResponse<any>;

    try {
      response = await axiosInstance.post(
        `/api/channels`,
        {
          channelName: channelName,
          chatServiceName: 'test-external',
          inChannel: true,
          enabled: true,
          queueOpen: true, // and gameDto
        },
        {
          withCredentials: true,
          responseType: 'json',
          headers: {
            Cookie: `jwt=${jwt}`,
          },
        }
      );
    } catch (e) {
      expect(e.status).toBe(422);
    }
  });

  it('should return a 422 if an invalid game is provided', async () => {});
  it('should create a channel but not join if inChannel is false', async () => {});

  it("should return a channel's details", async () => {});
  it('should return a 404 if a channel does not exist', async () => {});
  it('should trigger a channelJoin when setting inChannel to true', async () => {});
  it('should trigger a leaveChannel when setting inChannel to false', async () => {});
  it('should disable the bot when setting enabled to false', async () => {});
  it('should open the queue when queueOpen is set to true', async () => {});
  it('should close the queue when queueOpen is set to false', async () => {});
  it('should change the game when game is defined', async () => {});
  it('should return a 404 if the channel does not exist', async () => {});
});

import axios, { AxiosResponse } from 'axios';
import { getJwt } from '../../support/get-jwt';

describe('SongRequests controller (e2e)', () => {
  const axiosInstance = axios.create({
    baseURL: `http://localhost:${process.env.PORT}`,
    withCredentials: true,
    responseType: 'json',
  });

  xit('should set a song request as active', async () => {
    const channelName = 'channelwithrequests';
    // Use the generate-jwt command
    const jwt = getJwt(channelName);

    // try {
    const response = await axiosInstance.put(
      `/api/channels/${channelName}/song-requests/1`,
      { songRequestId: 1, isActive: true },
      {
        withCredentials: true,
        responseType: 'json',
        headers: {
          Cookie: `jwt=${jwt}`,
        },
      }
    );
    // } catch (e) {
    //   throw e;
    // }

    expect(response.status).toEqual(200);
    expect(response.data.id).toEqual(1);
    expect(response.data.isActive).toBeTruthy();
    let requestListResponse: AxiosResponse;

    try {
      requestListResponse = await axiosInstance.get(
        `/api/channels/${channelName}/song-requests`,
        {
          headers: {
            Cookie: `jwt=${jwt}`,
          },
        }
      );
    } catch (e) {
      console.log('Axios threw an error', e.toJSON());
    }

    expect(requestListResponse.data.length).toEqual(2);
    expect(requestListResponse.data[0].isActive).toBeTruthy();
    expect(requestListResponse.data[1].isActive).toBeFalsy();
  }, 15000); // The command to get the JWT takes a while..

  xit('should delete a song request for a broadcaster', async () => {
    const channelName = 'channelwithrequests';
    const jwt = getJwt(channelName);

    let response: AxiosResponse;
    try {
      response = await axiosInstance.delete(
        `/api/channels/${channelName}/song-requests/1`,
        {
          headers: {
            Cookie: `jwt=${jwt}`,
          },
        }
      );
    } catch (e) {
      if (Object.prototype.hasOwnProperty.call(e, 'toJSON')) {
        console.log('Axios threw an error', e.toJSON());
      } else {
        console.log('Axios threw an error - no toJSON available', e);
      }
    }

    expect(response.status).toEqual(200);

    // Get the song request list. It should not contain the request we just deleted.

    let requestListResponse: AxiosResponse;

    try {
      requestListResponse = await axiosInstance.get(
        `/api/channels/${channelName}/song-requests`,
        {
          headers: {
            Cookie: `jwt=${jwt}`,
          },
        }
      );
    } catch (e) {
      console.log('Axios threw an error', e.toJSON());
    }

    expect(requestListResponse.data.length).toEqual(1);
    expect(requestListResponse.data[0].id).not.toEqual(1);
  });

  // FIXME: Implement these tests.
  // xit('should return a 401 if no JWT is present in cookies', () => {});
  // xit('should return a 403 if the user is not the owner of the channel', () => {});
  // xit('should return a 400 if the song request id does not exist', () => {});
  // xit('should return a 403 if the user is not the owner of the channel AND is not the original requester of the song request', () => {});
  // xit('should delete the request if the user is the original requester of the song', () => {});
});

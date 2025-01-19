import { Inject, Injectable, Logger } from '@nestjs/common';
import { MOD_IO_API_KEY, MOD_IO_BASE_URL } from '../injection-tokens';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';

@Injectable()
export class ModIoApiService {
  private timeoutHandles: Map<string, any> = new Map<string, any>();
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    @Inject(MOD_IO_BASE_URL) private baseUrl: string,
    @Inject(MOD_IO_API_KEY) private apiKey: string,
    private httpService: HttpService,
  ) {}

  /**
   * Gets a list of all mods for the given game.  If we're rate limited,
   * this promise will not resolve until retrying after the wait period.
   *
   * @param modIoGameId
   */
  async getModsForGame(modIoGameId: number): Promise<any[]> {
    return new Promise<object[]>(async (resolve, reject) => {
      let morePagesRemain = true;
      let offset = 0;
      const results: object[] = [];
      while (morePagesRemain) {
        this.logger.log('Getting page of data');
        let result;
        try {
          result = await this.sendApiRequest(
            `${this.baseUrl}/games/${modIoGameId}/mods?_offset=${offset}&api_key=${this.apiKey}`,
          );
        } catch (e) {
          reject(e);
          return;
        }
        results.push(result);
        this.logger.log('result', {
          count: result.result_count,
          offset: result.result_offset,
          total: result.result_total,
        });
        if (result.result_count + result.result_offset >= result.result_total) {
          morePagesRemain = false;
        }
        offset += result.result_count;
      }

      this.logger.log('Done', { pages: results.length });
      resolve(results);
    });
  }

  private sendApiRequest(url: string): Promise<any> {
    return new Promise<object>((resolve, reject) => {
      this.httpService.get(url).subscribe({
        next: async (response) => {
          // Check if there's more pages of results.  If we don't have them all, keep getting the next page until we're done.
          resolve(response.data);
        },
        error: (e) => {
          reject(e);
        },
      });
    });
  }

  /**
   * Downloads a file to a destination path. If the rate limit is exceeded,
   * a timeout is set to wait for the limit time to pass before we try again.
   */
  async downloadModFile(
    binaryUrl: string,
    destinationPath: string,
  ): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const writer = fs.createWriteStream(destinationPath);
      let response;
      try {
        response = await this.httpService.axiosRef({
          url: binaryUrl,
          method: 'GET',
          responseType: 'stream',
        });
      } catch (e) {
        // If it's a 429, we'll wait to try again - this is a rate limit reached problem.
        if (e.response.status == 429) {
          // Rate-limited.  Let's wait for a long as they tell use before we try again.
          let retryWhen = 61000;
          if (e.response.headers['retry-when']) {
            retryWhen = parseInt(e.response.headers['retry-when']) * 1000;
          }

          this.logger.log('Received 429 - waiting to retry', {
            retryWhen: retryWhen,
          });
          this.timeoutHandles.set(
            'downloadModFile',
            setTimeout(async () => {
              this.timeoutHandles.delete('downloadModFile');
              resolve(await this.downloadModFile(binaryUrl, destinationPath));
            }, retryWhen),
          );
        } else {
          this.logger.warn('Caught an axios exception', { e });
          throw e;
        }
      }

      if (response) {
        response.data.pipe(writer);
        writer.on('finish', () => {
          resolve(destinationPath);
        });
      }
    });
  }
}

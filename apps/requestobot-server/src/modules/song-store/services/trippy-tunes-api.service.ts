import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TRIPPY_TUNES_BASE_URL } from '../injection-tokens';

/**
 * A service to handle API communications with trippytunes.club
 * API info: https://trippytunes.club/api/docs
 */
@Injectable()
export class TrippyTunesApiService {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TRIPPY_TUNES_BASE_URL) private baseUrl: string,
    private httpService: HttpService
  ) {}

  async getSongs(): Promise<any[] | null> {
    let resultsComplete = false;
    let offset = 0;

    const results: object[] = [];
    while (resultsComplete == false) {
      this.logger.log('Getting page of data');
      let result;
      try {
        result = await this.sendApiRequest(
          `${this.baseUrl}/songs?offset=${offset}&size=1000`
        );
      } catch (e) {
        this.logger.warn('sendApiRequest failed', { error: e.message });

        return null;
      }
      this.logger.log(`Retrieved ${result.length} songs`);

      if (result.length < 1) {
        this.logger.log(
          'Latest result was empty, considering this request complete'
        );

        resultsComplete = true;
      } else {
        results.push(result);

        offset += result.length;
      }
    }

    return results;
  }

  private sendApiRequest(url: string): Promise<any> {
    return new Promise<object>((resolve, reject) => {
      this.logger.log(`Requesting ${url}`);

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
}

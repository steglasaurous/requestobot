import { SongRequestErrorType } from './song-request-error-type.enum';

export interface SongRequestResponse {
  success: boolean;
  errorType?: SongRequestErrorType;
}

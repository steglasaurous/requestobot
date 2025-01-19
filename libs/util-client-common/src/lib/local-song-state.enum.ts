import { DownloadState } from './download-state.enum';

export interface LocalSongState {
  songId: number;
  downloadState: DownloadState;
  downloadProgress?: number;
}

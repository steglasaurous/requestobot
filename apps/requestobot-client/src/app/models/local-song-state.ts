export enum DownloadState {
  Waiting = 'waiting',
  InProgress = 'inprogress',
  Complete = 'complete',
  Failed = 'failed',
}
export interface LocalSongState {
  songId: number;
  downloadState: DownloadState;
  downloadProgress?: number;
}

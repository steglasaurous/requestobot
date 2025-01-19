import { SongDto } from '@requestobot/util-dto';

export interface DownloadHandler {
  songIsLocal(song: SongDto): boolean;
  downloadSong(song: SongDto, songStateCallback: any): Promise<void>;
  songSupported(song: SongDto): boolean;
  setSongsDir(songsDir: string): void;
  getSongsDir(): string;
}

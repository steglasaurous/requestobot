export interface SongDto {
  id: number;
  songHash: string;
  title: string;
  artist: string;
  mapper: string;
  duration?: number;
  bpm?: number;
  downloadUrl?: string;
  fileReference?: string;
  gameName: string;
  coverArtUrl?: string;
}

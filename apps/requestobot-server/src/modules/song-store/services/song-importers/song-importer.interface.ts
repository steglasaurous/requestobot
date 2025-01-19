export interface SongImporter {
  gameName: string;
  importSongs(): Promise<number>;
}

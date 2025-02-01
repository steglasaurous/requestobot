import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { SongRequest } from './song-request.entity';

@Entity()
// Ignoring the full text search index since it's not directly supported by
// typeorm - have to manage it manually.
// https://orkhan.gitbook.io/typeorm/docs/indices#disabling-synchronization
@Index('songSearchIdx', { synchronize: false })
@Unique(['songHash', 'game'])
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * A hash or any string that serves as a unique identifier for this song within a game.
   */
  @Column()
  songHash: string;
  @Column()
  title: string;
  @Column({ nullable: true })
  artist?: string;
  @Column()
  mapper: string;
  @Column({ nullable: true })
  duration?: number;
  @Column({ nullable: true })
  bpm?: number;

  @Column({ nullable: true })
  downloadUrl?: string;

  @Column({ nullable: true })
  coverArtUrl?: string;

  /**
   * If available, stores a reference of some sort (dependent on the source) that can
   * be used by a downloader to determine whether or not to download the song. (ex: auto-download song on request)
   *
   * Most useful for Spin Rhythm where links don't contain the actual file downloaded, but the file reference is the same
   * name as the .srtb filename, and can be used to check if the song already exists on the user's computer.
   */
  @Column({ nullable: true })
  fileReference: string;

  // This is a hash of the data fields: title, artist, mapper, duration, bpm, downloadUrl, coverArtUrl, fileReference
  // It can be used to quickly determine if something has changed in the song data during import,
  // and update accordingly.  If nothing's changed, it avoids an unnecessary database call.
  @Column()
  dataSignature: string;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

  @ManyToOne(() => Game, (game) => game.songs, { eager: true })
  game: Game;

  @OneToMany(() => SongRequest, (songRequest) => songRequest.song)
  requests: SongRequest[];

  @Column({
    generatedType: 'STORED',
    asExpression: `to_tsvector('english', coalesce(title, '') || ' ' || coalesce(artist, '') || ' ' || coalesce(mapper, ''))`,
    type: 'tsvector',
  })
  songSearch: string;
}

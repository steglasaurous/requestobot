import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { selectSongPlayer } from '../../+state/song-player/song-player.selector';
import { Store } from '@ngrx/store';
import {
  initialState,
  SongPlayerState,
} from '../../+state/song-player/song-player.reducer';
import { SongDto } from '@requestobot/util-dto';
import { log } from 'electron-log';

@Component({
  selector: 'app-song-player',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './song-player.component.html',
  styleUrl: './song-player.component.css',
})
export class SongPlayerComponent implements OnInit {
  song?: SongDto;
  playerState = 'stopped';
  volume = 100;

  songPlayerState: SongPlayerState = initialState;
  songPlayerState$ = this.store.select(selectSongPlayer);
  @ViewChild('audioPlayer')
  public _audioPlayerRef!: ElementRef;
  private audioPlayer!: HTMLMediaElement;

  constructor(private store: Store) {}

  ngOnInit() {
    this.songPlayerState$.subscribe((songPlayerState) => {
      this.songPlayerState = songPlayerState;
      if (
        this.song !== this.songPlayerState.song &&
        this.songPlayerState.song !== null
      ) {
        this.song = this.songPlayerState.song;
      }
      if (this.playerState !== this.songPlayerState.playerState) {
        this.audioPlayer = this._audioPlayerRef.nativeElement;

        if (this.songPlayerState.playerState == 'paused') {
          log('Pausing');
          this.audioPlayer.pause();
        } else if (this.songPlayerState.playerState == 'playing') {
          log('Playing');
          this.audioPlayer.play();
        } else if (this.songPlayerState.playerState == 'stopped') {
          log('Stopping');
          this.audioPlayer.pause();
          this.audioPlayer.fastSeek(0);
        }

        this.playerState = this.songPlayerState.playerState;
      }

      if (
        this.songPlayerState.volume &&
        this.volume !== this.songPlayerState.volume
      ) {
        log('Adjusting volume to ' + this.songPlayerState.volume);
        this.volume = this.songPlayerState.volume;
        this.audioPlayer.volume = this.volume / 100;
      }
    });
  }

  playing($event: Event) {
    this.audioPlayer = this._audioPlayerRef.nativeElement;
    this.audioPlayer.volume = this.volume / 100;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { SongPlayerActions } from '../../state/song-player/song-player.actions';
import { selectSongPlayer } from '../../../../../requestobot-overlay/src/app/+state/song-player.selector';
import { selectSongRequestQueue } from '../../state/song-requests/song-requests.selectors';
import { SongDto } from '@requestobot/util-dto';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-player-controls',
  imports: [
    CommonModule,
    FormsModule,
    MatIcon,
    MatSlider,
    MatSliderThumb,
    MatProgressBar,
    ProgressBar,
  ],
  standalone: true,
  templateUrl: './player-controls.component.html',
  styleUrl: './player-controls.component.css',
})
export class PlayerControlsComponent implements OnInit {
  position = 0;
  volume = 100;
  playerState = 'stopped';
  song: SongDto | null = null;
  playerState$ = this.store.select(selectSongPlayer);

  constructor(private store: Store) {}

  ngOnInit() {
    this.playerState$.subscribe((playerState) => {
      this.volume = playerState.volume;
      this.playerState = playerState.playerState;
      this.song = playerState.song;
    });
  }

  playerStop() {
    this.store.dispatch(SongPlayerActions.stop());
  }

  playerPause() {
    this.store.dispatch(SongPlayerActions.pause());
  }

  incrementVolume() {
    this.volume += 10;
    if (this.volume >= 100) {
      this.volume = 100;
    }

    this.store.dispatch(
      SongPlayerActions.volumeChange({ volume: this.volume })
    );
  }

  decrementVolume() {
    this.volume -= 10;
    if (this.volume < 0) {
      this.volume = 0;
    }

    this.store.dispatch(
      SongPlayerActions.volumeChange({ volume: this.volume })
    );
  }
  changeVolume(event: Event) {
    this.store.dispatch(
      SongPlayerActions.volumeChange({ volume: this.volume })
    );
  }

  playerPlay() {
    // FIXME: Logic here to figure out if there's a song to play or not.

    this.store.dispatch(SongPlayerActions.play({}));
  }

  nextSong() {}

  prevSong() {}
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { SongPlayerActions } from '../../state/song-player/song-player.actions';

@Component({
  selector: 'app-player-controls',
  imports: [CommonModule, FormsModule, MatIcon, MatSlider, MatSliderThumb],
  standalone: true,
  templateUrl: './player-controls.component.html',
  styleUrl: './player-controls.component.css',
})
export class PlayerControlsComponent {
  position = 0;
  volume = 100;
  constructor(private store: Store) {}

  playerStop() {}

  playerPause() {}

  changeVolume(event: Event) {
    this.store.dispatch(
      SongPlayerActions.volumeChange({ volume: this.volume })
    );
  }
}

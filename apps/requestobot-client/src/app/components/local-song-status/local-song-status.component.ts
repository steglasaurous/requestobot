import { Component, Input } from '@angular/core';
import { SongDto } from '@requestobot/util-dto';
import { DownloadState, LocalSongState } from '../../models/local-song-state';
import { MatIconModule } from '@angular/material/icon';
import { PercentPipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-local-song-status',
  standalone: true,
  imports: [MatIconModule, PercentPipe, MatProgressBar],
  templateUrl: './local-song-status.component.html',
})
export class LocalSongStatusComponent {
  @Input()
  song!: SongDto;

  @Input()
  songState?: LocalSongState = {
    downloadState: DownloadState.Waiting,
    songId: 0,
    downloadProgress: 0,
  };

  protected readonly DownloadState = DownloadState;
}

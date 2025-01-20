import { Component, Input, OnInit } from '@angular/core';
import { SongDto } from '@requestobot/util-dto';
import { DownloadState, LocalSongState } from '../../models/local-song-state';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, PercentPipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { selectSongDownloadStates } from '../../state/song-requests/song-requests.selectors';

@Component({
  selector: 'app-local-song-status',
  standalone: true,
  imports: [
    MatIconModule,
    PercentPipe,
    MatProgressBar,
    MatProgressSpinner,
    AsyncPipe,
  ],
  templateUrl: './local-song-status.component.html',
})
export class LocalSongStatusComponent implements OnInit {
  @Input()
  song!: SongDto;

  // @Input()
  songState?: LocalSongState = {
    downloadState: DownloadState.Waiting,
    songId: 0,
    downloadProgress: 0,
  };

  protected readonly DownloadState = DownloadState;

  protected downloadState$ = this.store.select(selectSongDownloadStates);
  constructor(private store: Store) {}
  public ngOnInit() {
    this.downloadState$.subscribe((downloadState) => {
      console.log('download state updated', downloadState);
      console.log('song is', this.song);
      console.log('has', this.song.id, downloadState.has(this.song.id));
      if (this.song && downloadState.has(this.song.id)) {
        console.log('setting song state', downloadState.get(this.song.id));
        this.songState = downloadState.get(this.song.id);
      }
    });
  }
}

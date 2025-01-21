import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SongDto } from '@requestobot/util-dto';
import { DownloadState, LocalSongState } from '../../models/local-song-state';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { selectSongDownloadStates } from '../../state/song-requests/song-requests.selectors';

@Component({
  selector: 'app-local-song-status',
  standalone: true,
  imports: [MatIconModule, MatProgressSpinner],
  templateUrl: './local-song-status.component.html',
})
export class LocalSongStatusComponent implements OnInit {
  @Input()
  song!: SongDto;

  songState?: LocalSongState = {
    downloadState: DownloadState.Waiting,
    songId: 0,
    downloadProgress: 0,
  };

  protected readonly DownloadState = DownloadState;

  downloadState$ = this.store.select(selectSongDownloadStates);
  constructor(private store: Store, private ref: ChangeDetectorRef) {}
  public ngOnInit() {
    this.downloadState$.subscribe((downloadState) => {
      if (this.song && downloadState[this.song.id]) {
        this.songState = downloadState[this.song.id];
        this.ref.detectChanges();
      }
    });
  }
}

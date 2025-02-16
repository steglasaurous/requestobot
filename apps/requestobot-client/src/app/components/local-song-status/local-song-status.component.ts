import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SongDto } from '@requestobot/util-dto';
import { DownloadState, LocalSongState } from '../../models/local-song-state';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { selectSongDownloadStates } from '../../state/song-requests/song-requests.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-local-song-status',
  imports: [MatIconModule, MatProgressSpinner],
  templateUrl: './local-song-status.component.html',
})
export class LocalSongStatusComponent implements OnInit, OnDestroy {
  @Input()
  song!: SongDto;

  songState?: LocalSongState = {
    downloadState: DownloadState.Waiting,
    songId: 0,
    downloadProgress: 0,
  };

  protected readonly DownloadState = DownloadState;
  private subscriptions: Subscription[] = [];

  downloadState$ = this.store.select(selectSongDownloadStates);
  constructor(private store: Store, private ref: ChangeDetectorRef) {}
  public ngOnInit() {
    this.subscriptions.push(
      this.downloadState$.subscribe((downloadState) => {
        if (this.song && downloadState[this.song.id]) {
          this.songState = downloadState[this.song.id];
          this.ref.detectChanges();
        }
      })
    );
  }
  public ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }
}

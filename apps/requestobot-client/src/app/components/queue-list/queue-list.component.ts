import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongRequestDto } from '@requestobot/util-dto';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { LocalSongStatusComponent } from '../local-song-status/local-song-status.component';
import { PanelComponent } from '../panel/panel.component';
import { Store } from '@ngrx/store';
import {
  selectSongDownloadStates,
  selectSongRequestQueue,
} from '../../state/song-requests/song-requests.selectors';
import { SongRequestsActions } from '../../state/song-requests/song-requests.actions';
import { SongDownloadStates } from '../../state/song-requests/song-requests.reducer';

@Component({
  selector: 'app-queue-list',
  imports: [
    CommonModule,
    DragDropModule,
    MatIcon,
    LocalSongStatusComponent,
    PanelComponent,
  ],
  providers: [],
  templateUrl: './queue-list.component.html',
})
export class QueueListComponent implements OnInit {
  songRequests: SongRequestDto[] = [];

  downloadedSongStatus: SongDownloadStates = {};

  nextSongDisabled = false;

  songRequestQueue$ = this.store.select(selectSongRequestQueue);
  songDownloadStates$ = this.store.select(selectSongDownloadStates);

  constructor(private store: Store) {}

  ngOnInit() {
    this.songRequestQueue$.subscribe((queue) => {
      // FYI: Apparently material drag and drop don't like working with observables directly.
      // (I get "newCollection[Symbol.iterator] is not a function" errors)
      // But they work fine with plain arrays.  This makes a copy of the array when it
      // changes so it can be rendered properly, and DnD works as expected.
      this.songRequests = Object.assign([], queue);
    });

    this.songDownloadStates$.subscribe((downloadedSongStatus) => {
      this.downloadedSongStatus = downloadedSongStatus;
    });

    this.store.dispatch(SongRequestsActions.getQueue());
  }

  drop($event: CdkDragDrop<any, any>) {
    // RE-order the list we have now, and send an API update to swap shit.
    // We got the previous and current index.  Use these to resolve them to our dataset

    // FYI this is here just so the UI doesn't jump when swapping positions.
    moveItemInArray(
      this.songRequests,
      $event.previousIndex,
      $event.currentIndex
    );

    this.store.dispatch(
      SongRequestsActions.swapRequestOrder({
        songRequestPreviousIndex: $event.previousIndex,
        songRequestCurrentIndex: $event.currentIndex,
      })
    );
  }

  deleteSongRequest(songRequestId: number) {
    this.store.dispatch(SongRequestsActions.deleteRequest({ songRequestId }));
  }

  setSongRequestActive(songRequestId: number) {
    this.store.dispatch(
      SongRequestsActions.setRequestActive({ songRequestId })
    );
  }

  nextSong() {
    // TODO: Disable the next song button while the request is in progress, then re-enable when the request completes (or fails)
    // this.nextSongDisabled = true;
    this.store.dispatch(SongRequestsActions.nextSong());
  }
}

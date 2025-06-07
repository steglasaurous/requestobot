import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { SongRequestDto } from '@requestobot/util-dto';
import { selectSongRequestQueue } from '../../+state/song-requests/song-requests.selector';

@Component({
  selector: 'app-queue-overlay',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './queue-overlay.component.html',
  styleUrl: './queue-overlay.component.css',
})
export class QueueOverlayComponent implements OnInit {
  @Input()
  overlayType = '';

  songRequests: SongRequestDto[] = [];
  songRequests$ = this.store.select(selectSongRequestQueue);
  constructor(private store: Store) {}

  ngOnInit() {
    this.songRequests$.subscribe((songRequests) => {
      console.log('songRequests are updated');
      this.songRequests = songRequests;
    });
  }
}

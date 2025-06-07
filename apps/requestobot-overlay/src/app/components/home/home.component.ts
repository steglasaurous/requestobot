import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { WebsocketActions } from '@requestobot/util-requestobot-websocket';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { SongPlayerComponent } from '../song-player/song-player.component';
import { QueueOverlayComponent } from '../queue-overlay/queue-overlay.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SongPlayerComponent, QueueOverlayComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  overlayType = '';

  constructor(private store: Store, private router: ActivatedRoute) {}
  ngOnInit() {
    this.router.queryParamMap.subscribe((queryParamMap) => {
      const channel = queryParamMap.get('channel');
      if (channel) {
        this.store.dispatch(
          WebsocketActions.connect({
            chatServiceName: 'twitch',
            channelName: channel,
            uri: environment.websocketUrl,
          })
        );
      } else {
        alert(
          'You must provide a channel in the querystring. Ex: ?channel=steglasaurous'
        );
      }

      const overlayType = queryParamMap.get('overlay_type');
      if (overlayType) {
        switch (overlayType) {
          case 'minivanillabot':
          case 'default':
            this.overlayType = overlayType;
            break;
        }
      }
    });
  }
}

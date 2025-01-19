import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';
import { Store } from '@ngrx/store';
import { ChannelActions } from '../../state/channel.actions';
import { selectChannel } from '../../state/channel.selectors';
import { AuthActions } from '../../state/auth.actions';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join.component.html',
})
export class JoinComponent {
  channel$ = this.store.select(selectChannel);

  constructor(private store: Store, private settingsService: SettingsService) {}

  async joinChannel() {
    const username = await this.settingsService.getValue('username');
    if (username == undefined) {
      console.error(
        'settingsService did not return username, unable to create channel'
      );
      return;
    }

    this.channel$.subscribe((channel) => {
      if (channel.id > 0) {
        this.store.dispatch(ChannelActions.joinChannel());
      } else {
        this.store.dispatch(
          ChannelActions.createChannel({
            chatServiceName: 'twitch',
            channelName: username,
          })
        );
      }
    });
  }

  async logout() {
    this.store.dispatch(AuthActions.logout());
  }
}

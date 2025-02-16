import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';
import { Store } from '@ngrx/store';
import { ChannelActions } from '../../state/channel/channel.actions';
import { selectChannel } from '../../state/channel/channel.selectors';
import { AuthActions } from '../../state/auth/auth.actions';
import { Subscription } from 'rxjs';
import log from 'electron-log/renderer';

@Component({
  selector: 'app-join',
  imports: [CommonModule],
  templateUrl: './join.component.html',
})
export class JoinComponent implements OnInit, OnDestroy {
  channel$ = this.store.select(selectChannel);
  channelExists = false;
  private subscriptions: Subscription[] = [];
  private username?: string;
  constructor(private store: Store, private settingsService: SettingsService) {}

  async ngOnInit() {
    log.debug('join OnInit');
    this.username = await this.settingsService.getValue('username');
    if (this.username == undefined) {
      log.error(
        'settingsService did not return username, unable to create channel'
      );
      return;
    }

    this.subscriptions.push(
      this.channel$.subscribe((channel) => {
        if (channel) {
          this.channelExists = true;
        } else {
          this.channelExists = false;
        }
      })
    );

    this.store.dispatch(
      ChannelActions.loadChannel({
        chatServiceName: 'twitch',
        channelName: this.username,
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }
  async joinChannel() {
    const username = await this.settingsService.getValue('username');
    if (username == undefined) {
      log.error(
        'settingsService did not return username, unable to create channel'
      );
      return;
    }

    if (this.channelExists) {
      this.store.dispatch(ChannelActions.joinChannel());
    } else {
      this.store.dispatch(
        ChannelActions.createChannel({
          chatServiceName: 'twitch',
          channelName: username,
        })
      );
    }
  }

  async logout() {
    this.store.dispatch(AuthActions.logout());
  }
}

import { Component, inject } from '@angular/core';
import { QueueListComponent } from '../../components/queue-list/queue-list.component';
import { SettingsService } from '../../services/settings.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChannelDto, GameDto } from '@requestobot/util-dto';
import { Router } from '@angular/router';
import { ButtonPrimaryComponent } from '../../components/button-primary/button-primary.component';
import { PanelComponent } from '../../components/panel/panel.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Store } from '@ngrx/store';
import { ChannelActions } from '../../state/channel/channel.actions';
import { selectChannelState } from '../../state/channel/channel.selectors';
import { AuthorizedState } from '../../models/authorized-state.enum';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { GamesActions } from '../../state/games/games.actions';
import { selectGamesState } from '../../state/games/games.selector';
import { AuthActions } from '../../state/auth/auth.actions';
import { MatIcon } from '@angular/material/icon';
import { SettingsComponent } from '../../components/settings/settings.component';
import { MatTooltip } from '@angular/material/tooltip';
import { ChannelLoadedState } from '../../state/channel/channel.reducer';
import { ToastrService } from 'ngx-toastr';
import { selectAuth } from '../../state/auth/auth.selectors';

@Component({
  selector: 'app-home',
  imports: [
    QueueListComponent,
    NgIf,
    MatSlideToggleModule,
    ButtonPrimaryComponent,
    PanelComponent,
    NgForOf,
    NgClass,
    MatProgressSpinner,
    MatIcon,
    MatTooltip,
  ],
  providers: [],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  channelName = '';
  channelState$ = this.store.select(selectChannelState);
  authState$ = this.store.select(selectAuth);
  channel: ChannelDto = {
    id: 0,
    channelName: '',
    inChannel: false,
    queueOpen: false,
    enabled: false,
    chatServiceName: 'twitch',
    game: {
      id: 0,
      displayName: '',
      setGameName: '',
      twitchCategoryId: '0',
      name: '',
    },
  };

  games: GameDto[] = [];
  games$ = this.store.select(selectGamesState);

  confirmDialog = inject(MatDialog);

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private store: Store,
    private toastr: ToastrService
  ) {
    this.games$.subscribe((games) => {
      this.games = games;
    });

    this.authState$.subscribe(async (authState) => {
      if (authState.authState === AuthorizedState.Authenticated) {
        // We're clear to proceed.
        this.store.dispatch(GamesActions.getGames());
        this.settingsService.getValue('username').then((value) => {
          if (value != undefined) {
            this.channelName = value;
          }

          this.updateChannelInfo();
        });
      } else if (authState.authState === AuthorizedState.ConnectionFailure) {
        this.toastr.error('Failed to connect to the server, retrying...');
      }
    });

    // This checks to make sure our JWT is valid.  If not, it'll attempt to refresh it with a refresh token.
    this.store.dispatch(AuthActions.checkAuth());
    this.channelState$.subscribe((channelState) => {
      if (channelState.channelLoadedState === ChannelLoadedState.Fail) {
        // FIXME: do a retry of some sort here?  or in effects?
        this.toastr.error('Failed to load channel details from API');
      }
      const channel = channelState.channel;
      if (channel) {
        this.channel = channel;

        // Do checks
        if (!channel.inChannel) {
          // The bot is not present in the user's channel.  Goto join to ask to invite it back.
          this.router.navigate(['join']);

          return;
        }
      }
    });
  }

  updateChannelInfo() {
    this.store.dispatch(
      ChannelActions.loadChannel({
        chatServiceName: 'twitch',
        channelName: this.channelName,
      })
    );
  }

  async logout() {
    this.store.dispatch(AuthActions.logout());
  }

  toggleQueueOpen() {
    if (this.channel.queueOpen) {
      this.store.dispatch(ChannelActions.closeQueue());
    } else {
      this.store.dispatch(ChannelActions.openQueue());
    }
  }

  selectGame(game: GameDto) {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Change Game',
        message:
          'Are you sure you want to change games?  Warning: This will clear the queue.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(ChannelActions.setGame({ game: game }));
      }
    });
  }

  getChannelSetting(settingName: string): string {
    if (this.channel.settings) {
      for (const setting of this.channel.settings) {
        if (setting.settingName === settingName) {
          return setting.value;
        }
      }
    }

    return '';
  }

  setChannelSetting(settingName: string, value: string) {
    console.log('setChannelSetting', settingName, value);
    this.store.dispatch(
      ChannelActions.setSetting({ settingName: settingName, value: value })
    );
  }

  clearQueue() {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Clear Queue',
        message: 'Are you sure you want to clear the entire queue?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(ChannelActions.clearQueue());
      }
    });
  }

  showSettings() {
    this.confirmDialog.open(SettingsComponent, {
      data: {},
    });
  }

  toggleBotEnabled() {
    if (this.channel.enabled) {
      console.log('Disabling bot');
      this.store.dispatch(ChannelActions.disableBot());
    } else {
      console.log('Enabling bot');
      this.store.dispatch(ChannelActions.enableBot());
    }
  }
}

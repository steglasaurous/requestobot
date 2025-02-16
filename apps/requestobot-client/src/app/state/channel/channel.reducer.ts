import { ChannelDto, GameDto, SettingDto } from '@requestobot/util-dto';
import { createReducer, on } from '@ngrx/store';
import { ChannelActions } from './channel.actions';
import { AuthActions } from '../auth/auth.actions';

export enum ChannelLoadedState {
  NotLoaded,
  Loaded,
  Fail,
  NotFound,
}

export interface ChannelState {
  channelLoadedState: ChannelLoadedState;
  channel?: ChannelDto;
  previousGame?: GameDto;
  previousSetting?: { isNew: boolean; settingName: string; value?: string };
}

export const initialState: ChannelState = {
  channelLoadedState: ChannelLoadedState.NotLoaded,
  channel: undefined,
  previousGame: undefined,
  previousSetting: undefined,
};

export const channelReducer = createReducer(
  initialState,
  on(ChannelActions.loadChannelSuccess, (_state, { channel }) => {
    return { channelLoadedState: ChannelLoadedState.Loaded, channel: channel };
  }),
  on(
    ChannelActions.loadChannelFail,
    (state, { chatServiceName, channelName, error }) => {
      let channelLoadedState = ChannelLoadedState.Fail;
      if (error.status === 404) {
        channelLoadedState = ChannelLoadedState.NotFound;
      }
      return { ...state, channelLoadedState: channelLoadedState };
    }
  ),
  on(ChannelActions.openQueue, (state) => {
    if (!state.channel) {
      return state;
    }

    return { ...state, channel: { ...state.channel, queueOpen: true } };
  }),
  on(ChannelActions.openQueueFail, (state) => {
    if (!state.channel) {
      return state;
    }

    return { ...state, channel: { ...state.channel, queueOpen: false } };
  }),
  on(ChannelActions.closeQueue, (state) => {
    if (!state.channel) {
      return state;
    }
    return { ...state, channel: { ...state.channel, queueOpen: false } };
  }),
  on(ChannelActions.closeQueueFail, (state) => {
    if (!state.channel) {
      return state;
    }

    return { ...state, channel: { ...state.channel, queueOpen: true } };
  }),
  on(ChannelActions.setGame, (state, { game }) => {
    if (!state.channel) {
      return state;
    }
    return {
      ...state,
      channel: { ...state.channel, game: game },
      previousGame: state.channel.game,
    };
  }),
  on(ChannelActions.setGameSuccess, (state) => {
    if (!state.channel) {
      return state;
    }
    if (state.previousGame) {
      return { ...state, previousGame: undefined };
    }

    return state;
  }),
  on(ChannelActions.setGameFail, (state) => {
    // return state;
    if (!state.channel) {
      return state;
    }

    if (state.previousGame) {
      return {
        ...state,
        channel: { ...state.channel, game: state.previousGame },
        previousGame: undefined,
      };
    }

    // If no previous game was populated for some reason, fall back to
    // not changing anything.  In theory this should never happen.
    return state;
  }),
  on(ChannelActions.setSetting, (state, { settingName, value }) => {
    if (!state.channel) {
      return state;
    }
    const settings: SettingDto[] = [];
    if (state.channel && state.channel.settings) {
      for (const setting of state.channel.settings) {
        settings.push({ ...setting });
      }
    }

    for (const setting of settings) {
      if (setting.settingName === settingName) {
        const previousValue = setting.value;
        setting.value = value;

        return {
          ...state,
          channel: { ...state.channel, settings: settings },
          previousSetting: {
            isNew: false,
            settingName: settingName,
            value: previousValue,
          },
        };
      }
    }
    // If it doesnt exist, we add it.
    settings.push({
      settingName: settingName,
      value: value,
      channelId: state.channel.id,
    });

    return {
      ...state,
      channel: { ...state.channel, settings: settings },
      previousSetting: {
        isNew: true,
        settingName: settingName,
        value: undefined,
      },
    };
  }),
  on(ChannelActions.setSettingFail, (state) => {
    if (!state.channel) {
      return state;
    }
    if (!state.previousSetting) {
      return state;
    }

    let settings: SettingDto[] = [];
    if (state.channel && state.channel.settings) {
      for (const setting of state.channel.settings) {
        settings.push({ ...setting });
      }
    }

    if (state.previousSetting.isNew) {
      settings.filter(
        (setting) => setting.settingName !== state.previousSetting?.settingName
      );
    } else {
      settings = settings.map((setting) => {
        if (
          setting.settingName === state.previousSetting?.settingName &&
          state.previousSetting?.value
        ) {
          setting.value = state.previousSetting?.value;
        }
        return setting;
      });
    }

    return {
      ...state,
      channel: { ...state.channel, settings: settings },
      previousSetting: undefined,
    };
  }),
  on(ChannelActions.setSettingSuccess, (state) => {
    if (!state.channel) {
      return state;
    }

    return { ...state, previousSetting: undefined };
  }),
  on(AuthActions.logout, () => {
    return initialState;
  }),
  on(ChannelActions.enableBot, (state) => {
    if (!state.channel) {
      return state;
    }
    return { ...state, channel: { ...state.channel, enabled: true } };
  }),
  on(ChannelActions.enableBotFail, (state) => {
    if (!state.channel) {
      return state;
    }
    return { ...state, channel: { ...state.channel, enabled: false } };
  }),
  on(ChannelActions.disableBot, (state) => {
    if (!state.channel) {
      return state;
    }
    return { ...state, channel: { ...state.channel, enabled: false } };
  }),
  on(ChannelActions.disableBotFail, (state) => {
    if (!state.channel) {
      return state;
    }
    return { ...state, channel: { ...state.channel, enabled: true } };
  })
);

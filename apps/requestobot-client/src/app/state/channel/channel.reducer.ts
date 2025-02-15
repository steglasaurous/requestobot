import { ChannelDto, SettingDto } from '@requestobot/util-dto';
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
}

export const initialState: ChannelState = {
  channelLoadedState: ChannelLoadedState.NotLoaded,
  channel: undefined,
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
    return { ...state, channel: { ...state.channel, game: game } };
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
        setting.value = value;

        return { ...state, channel: { ...state.channel, settings: settings } };
      }
    }
    // If it doesnt exist, we add it.
    settings.push({
      settingName: settingName,
      value: value,
      channelId: state.channel.id,
    });

    return { ...state, channel: { ...state.channel, settings: settings } };
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
  on(ChannelActions.disableBot, (state) => {
    if (!state.channel) {
      return state;
    }
    return { ...state, enabled: false };
  })
);

import { ChannelDto, SettingDto } from '@requestobot/util-dto';
import { createReducer, on } from '@ngrx/store';
import { ChannelActions } from './channel.actions';
import { AuthActions } from './auth.actions';

export const initialState: ChannelDto = {
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
export const channelReducer = createReducer(
  initialState,
  on(ChannelActions.loadChannelSuccess, (_state, { channel }) => channel),
  on(ChannelActions.openQueue, (state) => {
    return { ...state, queueOpen: true };
  }),
  on(ChannelActions.closeQueue, (state) => {
    return { ...state, queueOpen: false };
  }),
  on(ChannelActions.setGame, (state, { game }) => {
    return { ...state, game: game };
  }),
  on(ChannelActions.setSetting, (state, { settingName, value }) => {
    const settings: SettingDto[] = [];
    if (state.settings) {
      for (const setting of state.settings) {
        settings.push({ ...setting });
      }
    }

    for (const setting of settings) {
      if (setting.settingName === settingName) {
        setting.value = value;

        return { ...state, settings: settings };
      }
    }
    // If it doesnt exist, we add it.
    settings.push({
      settingName: settingName,
      value: value,
      channelId: state.id,
    });

    return { ...state, settings: settings };
  }),
  on(AuthActions.logout, () => {
    return initialState;
  })
);

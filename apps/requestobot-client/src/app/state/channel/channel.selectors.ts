import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelState } from './channel.reducer';

export const selectChannelState =
  createFeatureSelector<ChannelState>('channel');

export const selectChannel = createSelector(selectChannelState, (state) => {
  return state.channel;
});

export const selectChannelLoadedState = createSelector(
  selectChannelState,
  (state) => {
    return state.channelLoadedState;
  }
);

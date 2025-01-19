import { createFeatureSelector } from '@ngrx/store';
import { ChannelDto } from '@requestobot/util-dto';

export const selectChannel = createFeatureSelector<ChannelDto>('channel');

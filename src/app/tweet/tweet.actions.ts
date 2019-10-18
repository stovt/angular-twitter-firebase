import { Action } from '@ngrx/store';

import { Tweet } from './tweet.model';

export const SET_ALL_TWEETS = '[Auth] Set All Tweets';

export class SetAllTweets implements Action {
  readonly type = SET_ALL_TWEETS;

  constructor(public payload: Tweet[]) {}
}

export type TweetActions = SetAllTweets;

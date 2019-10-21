import { Action } from '@ngrx/store';

import { Tweet } from './tweet.model';

export const SET_ALL_TWEETS = '[Tweet] Set All Tweets';
export const SET_USER_TWEETS = '[Tweet] Set User Tweets';
export const RESET = '[Tweet] RESET';

export class SetAllTweets implements Action {
  readonly type = SET_ALL_TWEETS;

  constructor(public payload: Tweet[]) {}
}

export class SetUserTweets implements Action {
  readonly type = SET_USER_TWEETS;

  constructor(
    public payload: {
      userId: string;
      tweets: Tweet[];
    }
  ) {}
}

export class Reset implements Action {
  readonly type = RESET;
}

export type TweetActions = SetAllTweets | SetUserTweets | Reset;

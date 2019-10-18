import { Action } from '@ngrx/store';

import { Tweet } from './tweet.model';

export const SET_ALL_TWEETS = '[Auth] Set All Tweets';
export const SET_USER_TWEETS = '[Auth] Set User Tweets';

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

export type TweetActions = SetAllTweets | SetUserTweets;

import { Action } from '@ngrx/store';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';

import { Tweet } from './tweet.model';

export const ALL_TWEETS_ADDED = '[Tweet] All Tweets added';
export const ALL_TWEETS_MODIFIED = '[Tweet] All Tweets modified';
export const ALL_TWEETS_REMOVED = '[Tweet] All Tweets removed';
export const ALL_TWEETS_DONE = '[Tweet] All Tweets done';
export const SET_USER_TWEETS = '[Tweet] Set User Tweets';
export const SET_TWEET_COMMENTS = '[Tweet] Set Tweet Comments';
export const RESET = '[Tweet] RESET';

export class SetAllTweetsAdded implements Action {
  readonly type = ALL_TWEETS_ADDED;

  constructor(
    public payload: {
      tweet: Tweet;
      doc: QueryDocumentSnapshot<Tweet>;
    }
  ) {}
}

export class SetAllTweetsModified implements Action {
  readonly type = ALL_TWEETS_MODIFIED;

  constructor(
    public payload: {
      tweet: Tweet;
      doc: QueryDocumentSnapshot<Tweet>;
    }
  ) {}
}

export class SetAllTweetsRemoved implements Action {
  readonly type = ALL_TWEETS_REMOVED;

  constructor(
    public payload: {
      tweet: Tweet;
      doc: QueryDocumentSnapshot<Tweet>;
    }
  ) {}
}

export class SetAllTweetsDone implements Action {
  readonly type = ALL_TWEETS_DONE;
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

export class SetTweetComments implements Action {
  readonly type = SET_TWEET_COMMENTS;

  constructor(
    public payload: {
      tweetId: string;
      comments: Tweet[];
    }
  ) {}
}

export class Reset implements Action {
  readonly type = RESET;
}

export type TweetActions =
  | SetAllTweetsAdded
  | SetAllTweetsModified
  | SetAllTweetsRemoved
  | SetAllTweetsDone
  | SetUserTweets
  | SetTweetComments
  | Reset;

import { Action } from '@ngrx/store';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';

import { Tweet } from './tweet.model';

export const ALL_TWEETS_ADDED = '[Tweet] All Tweets added';
export const ALL_TWEETS_MODIFIED = '[Tweet] All Tweets modified';
export const ALL_TWEETS_REMOVED = '[Tweet] All Tweets removed';
export const ALL_TWEETS_DONE = '[Tweet] All Tweets done';
export const USER_TWEETS_ADDED = '[Tweet] User Tweets added';
export const USER_TWEETS_MODIFIED = '[Tweet] User Tweets modified';
export const USER_TWEETS_REMOVED = '[Tweet] User Tweets removed';
export const USER_TWEETS_DONE = '[Tweet] User Tweets done';
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

export class SetUserTweetsAdded implements Action {
  readonly type = USER_TWEETS_ADDED;

  constructor(
    public payload: {
      userId: string;
      tweet: Tweet;
      doc: QueryDocumentSnapshot<Tweet>;
    }
  ) {}
}

export class SetUserTweetsModified implements Action {
  readonly type = USER_TWEETS_MODIFIED;

  constructor(
    public payload: {
      userId: string;
      tweet: Tweet;
      doc: QueryDocumentSnapshot<Tweet>;
    }
  ) {}
}

export class SetUserTweetsRemoved implements Action {
  readonly type = USER_TWEETS_REMOVED;

  constructor(
    public payload: {
      userId: string;
      tweet: Tweet;
      doc: QueryDocumentSnapshot<Tweet>;
    }
  ) {}
}

export class SetUserTweetsDone implements Action {
  readonly type = USER_TWEETS_DONE;

  constructor(public payload: string) {}
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
  | SetUserTweetsAdded
  | SetUserTweetsModified
  | SetUserTweetsRemoved
  | SetUserTweetsDone
  | SetTweetComments
  | Reset;

import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import {
  TweetActions,
  ALL_TWEETS_ADDED,
  ALL_TWEETS_MODIFIED,
  ALL_TWEETS_REMOVED,
  ALL_TWEETS_DONE,
  USER_TWEETS_ADDED,
  USER_TWEETS_MODIFIED,
  USER_TWEETS_REMOVED,
  USER_TWEETS_DONE,
  SET_TWEET_COMMENTS,
  RESET
} from './tweet.actions';

import { Tweet } from './tweet.model';

export interface State {
  allTweets: {
    tweets: Tweet[];
    docs: QueryDocumentSnapshot<Tweet>[];
    done: boolean;
  };
  tweetsByUserId: Record<
    string,
    {
      tweets?: Tweet[];
      docs?: QueryDocumentSnapshot<Tweet>[];
      done?: boolean;
    }
  >;
  commentsByTweetId: Record<string, Tweet[]>;
}

const initialState: State = {
  allTweets: {
    tweets: [],
    docs: [],
    done: false
  },
  tweetsByUserId: {},
  commentsByTweetId: {}
};

export function tweetReducer(state = initialState, action: TweetActions) {
  switch (action.type) {
    case ALL_TWEETS_ADDED:
      return {
        ...state,
        allTweets: {
          ...state.allTweets,
          tweets: [...state.allTweets.tweets, action.payload.tweet],
          docs: [...state.allTweets.docs, action.payload.doc]
        }
      };
    case ALL_TWEETS_MODIFIED:
      return {
        ...state,
        allTweets: {
          ...state.allTweets,
          tweets: state.allTweets.tweets.map(tweet => {
            if (tweet.id === action.payload.tweet.id) {
              return action.payload.tweet;
            }
            return tweet;
          }),
          docs: state.allTweets.docs.map(doc => {
            if (doc.id === action.payload.doc.id) {
              return action.payload.doc;
            }
            return doc;
          })
        }
      };
    case ALL_TWEETS_REMOVED:
      return {
        ...state,
        allTweets: {
          ...state.allTweets,
          tweets: state.allTweets.tweets.filter(t => t.id !== action.payload.tweet.id),
          docs: state.allTweets.docs.filter(d => d.id !== action.payload.doc.id)
        }
      };
    case ALL_TWEETS_DONE:
      return {
        ...state,
        allTweets: {
          ...state.allTweets,
          done: true
        }
      };
    case USER_TWEETS_ADDED:
      return {
        ...state,
        tweetsByUserId: {
          ...state.tweetsByUserId,
          [action.payload.userId]: {
            ...(state.tweetsByUserId[action.payload.userId] || {}),
            tweets:
              state.tweetsByUserId[action.payload.userId] &&
              state.tweetsByUserId[action.payload.userId].tweets
                ? [...state.tweetsByUserId[action.payload.userId].tweets, action.payload.tweet]
                : [action.payload.tweet],
            docs:
              state.tweetsByUserId[action.payload.userId] &&
              state.tweetsByUserId[action.payload.userId].docs
                ? [...state.tweetsByUserId[action.payload.userId].docs, action.payload.doc]
                : [action.payload.doc]
          }
        }
      };
    case USER_TWEETS_MODIFIED:
      return {
        ...state,
        tweetsByUserId: {
          ...state.tweetsByUserId,
          [action.payload.userId]: {
            ...state.tweetsByUserId[action.payload.userId],
            tweets: state.tweetsByUserId[action.payload.userId].tweets.map(tweet => {
              if (tweet.id === action.payload.tweet.id) {
                return action.payload.tweet;
              }
              return tweet;
            }),
            docs: state.tweetsByUserId[action.payload.userId].docs.map(doc => {
              if (doc.id === action.payload.doc.id) {
                return action.payload.doc;
              }
              return doc;
            })
          }
        }
      };
    case USER_TWEETS_REMOVED:
      return {
        ...state,
        tweetsByUserId: {
          ...state.tweetsByUserId,
          [action.payload.userId]: {
            ...state.tweetsByUserId[action.payload.userId],
            tweets: state.tweetsByUserId[action.payload.userId].tweets.filter(
              t => t.id !== action.payload.tweet.id
            ),
            docs: state.tweetsByUserId[action.payload.userId].docs.filter(
              d => d.id !== action.payload.doc.id
            )
          }
        }
      };
    case USER_TWEETS_DONE:
      return {
        ...state,
        tweetsByUserId: {
          ...state.tweetsByUserId,
          [action.payload]: {
            ...(state.tweetsByUserId[action.payload] || {}),
            done: true
          }
        }
      };
    case SET_TWEET_COMMENTS:
      return {
        ...state,
        commentsByTweetId: {
          ...state.commentsByTweetId,
          [action.payload.tweetId]: action.payload.comments
        }
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export const getAllTweets = (state: State) =>
  state.allTweets.tweets.sort(
    (a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
  );
export const getAllTweetsCursor = (state: State) =>
  state.allTweets.docs.sort(
    (a, b) =>
      b
        .data()
        .createdAt.toDate()
        .getTime() -
      a
        .data()
        .createdAt.toDate()
        .getTime()
  )[state.allTweets.docs.length - 1];
export const getIsAllTweetsLoaded = (state: State) => state.allTweets.done;

export const getUserTweets = (userId: string) => (state: State) =>
  state.tweetsByUserId[userId] && state.tweetsByUserId[userId].tweets
    ? state.tweetsByUserId[userId].tweets.sort(
        (a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
      )
    : [];
export const getUserTweetsCursor = (userId: string) => (state: State) =>
  state.tweetsByUserId[userId] && state.tweetsByUserId[userId].docs
    ? state.tweetsByUserId[userId].docs.sort(
        (a, b) =>
          b
            .data()
            .createdAt.toDate()
            .getTime() -
          a
            .data()
            .createdAt.toDate()
            .getTime()
      )[state.tweetsByUserId[userId].docs.length - 1]
    : null;
export const getIsUserTweetsLoaded = (userId: string) => (state: State) =>
  state.tweetsByUserId[userId] && state.tweetsByUserId[userId].done
    ? state.tweetsByUserId[userId].done
    : false;

export const getTweetComments = (tweetId: string) => (state: State) =>
  state.commentsByTweetId[tweetId] || [];

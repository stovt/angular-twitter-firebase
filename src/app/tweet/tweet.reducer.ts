import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import {
  TweetActions,
  ALL_TWEETS_ADDED,
  ALL_TWEETS_MODIFIED,
  ALL_TWEETS_REMOVED,
  ALL_TWEETS_DONE,
  SET_USER_TWEETS,
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
  tweetsByUserId: Record<string, Tweet[]>;
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
    case SET_USER_TWEETS:
      return {
        ...state,
        tweetsByUserId: {
          ...state.tweetsByUserId,
          [action.payload.userId]: action.payload.tweets
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
  state.tweetsByUserId[userId] || [];
export const getTweetComments = (tweetId: string) => (state: State) =>
  state.commentsByTweetId[tweetId] || [];

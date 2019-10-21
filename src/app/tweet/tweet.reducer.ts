import {
  TweetActions,
  SET_ALL_TWEETS,
  SET_USER_TWEETS,
  SET_TWEET_COMMENTS,
  RESET
} from './tweet.actions';

import { Tweet } from './tweet.model';

export interface State {
  allTweets: Tweet[];
  tweetsByUserId: Record<string, Tweet[]>;
  commentsByTweetId: Record<string, Tweet[]>;
}

const initialState: State = {
  allTweets: [],
  tweetsByUserId: {},
  commentsByTweetId: {}
};

export function tweetReducer(state = initialState, action: TweetActions) {
  switch (action.type) {
    case SET_ALL_TWEETS:
      return {
        ...state,
        allTweets: action.payload
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

export const getAllTweets = (state: State) => state.allTweets;
export const getUserTweets = (userId: string) => (state: State) =>
  state.tweetsByUserId[userId] || [];
export const getTweetComments = (tweetId: string) => (state: State) =>
  state.commentsByTweetId[tweetId] || [];

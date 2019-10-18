import { TweetActions, SET_ALL_TWEETS, SET_USER_TWEETS } from './tweet.actions';

import { Tweet } from './tweet.model';

export interface State {
  allTweets: Tweet[];
  tweetsByUserId: Record<string, Tweet[]>;
}

const initialState: State = {
  allTweets: [],
  tweetsByUserId: {}
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
    default:
      return state;
  }
}

export const getAllTweets = (state: State) => state.allTweets;
export const getUserTweets = (userId: string) => (state: State) =>
  state.tweetsByUserId[userId] || [];

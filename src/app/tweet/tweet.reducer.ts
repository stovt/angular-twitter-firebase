import { TweetActions, SET_ALL_TWEETS } from './tweet.actions';

import { Tweet } from './tweet.model';

export interface State {
  allTweets: Tweet[];
}

const initialState: State = {
  allTweets: []
};

export function tweetReducer(state = initialState, action: TweetActions) {
  switch (action.type) {
    case SET_ALL_TWEETS:
      return {
        ...state,
        allTweets: action.payload
      };
    default:
      return state;
  }
}

export const getAllTweets = (state: State) => state.allTweets;

import {
  UIActions,
  START_LOADING_USERS,
  STOP_LOADING_USERS,
  START_LOADING_TWEET,
  STOP_LOADING_TWEET,
  START_LOADING_ALL_TWEETS,
  STOP_LOADING_ALL_TWEETS
} from './ui.actions';

export interface State {
  isUsersLoading: boolean;
  isTweetLoading: boolean;
  isAllTweetsLoading: boolean;
}

const initialState: State = {
  isUsersLoading: false,
  isTweetLoading: false,
  isAllTweetsLoading: false
};

export function uiReducer(state = initialState, action: UIActions) {
  switch (action.type) {
    case START_LOADING_USERS:
      return {
        ...state,
        isUsersLoading: true
      };
    case STOP_LOADING_USERS:
      return {
        ...state,
        isUsersLoading: false
      };
    case START_LOADING_TWEET:
      return {
        ...state,
        isTweetLoading: true
      };
    case STOP_LOADING_TWEET:
      return {
        ...state,
        isTweetLoading: false
      };
    case START_LOADING_ALL_TWEETS:
      return {
        ...state,
        isAllTweetsLoading: true
      };
    case STOP_LOADING_ALL_TWEETS:
      return {
        ...state,
        isAllTweetsLoading: false
      };
    default:
      return state;
  }
}

export const getIsUsersLoading = (state: State) => state.isUsersLoading;
export const getIsTweetLoading = (state: State) => state.isTweetLoading;
export const getIsAllTweetsLoading = (state: State) => state.isAllTweetsLoading;

import {
  UIActions,
  START_LOADING_USERS,
  STOP_LOADING_USERS,
  START_LOADING_TWEET,
  STOP_LOADING_TWEET,
  START_LOADING_ALL_TWEETS,
  STOP_LOADING_ALL_TWEETS,
  START_LOADING_USER_TWEETS,
  STOP_LOADING_USER_TWEETS
} from './ui.actions';

export interface State {
  isUsersLoading: boolean;
  isTweetLoading: boolean;
  isAllTweetsLoading: boolean;
  isTweetsByUserIdLoading: Record<string, boolean>;
}

const initialState: State = {
  isUsersLoading: false,
  isTweetLoading: false,
  isAllTweetsLoading: false,
  isTweetsByUserIdLoading: {}
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
    case START_LOADING_USER_TWEETS:
      return {
        ...state,
        isTweetsByUserIdLoading: {
          ...state.isTweetsByUserIdLoading,
          [action.payload]: true
        }
      };
    case STOP_LOADING_USER_TWEETS:
      return {
        ...state,
        isTweetsByUserIdLoading: {
          ...state.isTweetsByUserIdLoading,
          [action.payload]: false
        }
      };
    default:
      return state;
  }
}

export const getIsUsersLoading = (state: State) => state.isUsersLoading;
export const getIsTweetLoading = (state: State) => state.isTweetLoading;
export const getIsAllTweetsLoading = (state: State) => state.isAllTweetsLoading;
export const getIsTweetsByUserIdLoading = (userId: string) => (state: State) =>
  state.isTweetsByUserIdLoading[userId] || false;

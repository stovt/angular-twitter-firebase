import {
  UIActions,
  START_LOADING_USERS,
  STOP_LOADING_USERS,
  START_LOADING_TWEET,
  STOP_LOADING_TWEET,
  START_LOADING_ALL_TWEETS,
  STOP_LOADING_ALL_TWEETS,
  START_LOADING_USER_TWEETS,
  STOP_LOADING_USER_TWEETS,
  START_LOADING_USER,
  STOP_LOADING_USER,
  START_LOADING_COMMENT,
  STOP_LOADING_COMMENT,
  START_LOADING_COMMENTS,
  STOP_LOADING_COMMENTS,
  START_LOADING_PROFILE_SETTINGS,
  STOP_LOADING_PROFILE_SETTINGS
} from './ui.actions';

export interface State {
  isUsersLoading: boolean;
  isTweetLoading: boolean;
  isCommentByTweetIdLoading: Record<string, boolean>;
  isCommentsByTweetIdLoading: Record<string, boolean>;
  isAllTweetsLoading: boolean;
  isTweetsByUserIdLoading: Record<string, boolean>;
  isUserLoading: Record<string, boolean>;
  isProfileSettingsLoading: boolean;
}

const initialState: State = {
  isUsersLoading: false,
  isTweetLoading: false,
  isCommentByTweetIdLoading: {},
  isCommentsByTweetIdLoading: {},
  isAllTweetsLoading: false,
  isTweetsByUserIdLoading: {},
  isUserLoading: {},
  isProfileSettingsLoading: false
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
    case START_LOADING_USER:
      return {
        ...state,
        isUserLoading: {
          ...state.isUserLoading,
          [action.payload]: true
        }
      };
    case STOP_LOADING_USER:
      return {
        ...state,
        isUserLoading: {
          ...state.isUserLoading,
          [action.payload]: false
        }
      };
    case START_LOADING_COMMENT:
      return {
        ...state,
        isCommentByTweetIdLoading: {
          ...state.isCommentByTweetIdLoading,
          [action.payload]: true
        }
      };
    case STOP_LOADING_COMMENT:
      return {
        ...state,
        isCommentByTweetIdLoading: {
          ...state.isCommentByTweetIdLoading,
          [action.payload]: false
        }
      };
    case START_LOADING_COMMENTS:
      return {
        ...state,
        isCommentsByTweetIdLoading: {
          ...state.isCommentsByTweetIdLoading,
          [action.payload]: true
        }
      };
    case STOP_LOADING_COMMENTS:
      return {
        ...state,
        isCommentsByTweetIdLoading: {
          ...state.isCommentsByTweetIdLoading,
          [action.payload]: false
        }
      };
    case START_LOADING_PROFILE_SETTINGS:
      return {
        ...state,
        isProfileSettingsLoading: true
      };
    case STOP_LOADING_PROFILE_SETTINGS:
      return {
        ...state,
        isProfileSettingsLoading: false
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
export const getIsUserLoading = (id: string) => (state: State) => state.isUserLoading[id] || false;
export const getIsCommentByTweetIdLoading = (tweetId: string) => (state: State) =>
  state.isCommentByTweetIdLoading[tweetId] || false;
export const getIsCommentsByTweetIdLoading = (tweetId: string) => (state: State) =>
  state.isCommentsByTweetIdLoading[tweetId] || false;
export const getIsProfileSettingsLoading = (state: State) => state.isProfileSettingsLoading;

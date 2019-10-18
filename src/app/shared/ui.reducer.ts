import {
  UIActions,
  START_LOADING_USERS,
  STOP_LOADING_USERS,
  START_LOADING_TWEET,
  STOP_LOADING_TWEET
} from './ui.actions';

export interface State {
  isUsersLoading: boolean;
  isTweetLoading: boolean;
}

const initialState: State = {
  isUsersLoading: false,
  isTweetLoading: false
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
    default:
      return state;
  }
}

export const getIsUsersLoading = (state: State) => state.isUsersLoading;
export const getIsTweetLoading = (state: State) => state.isTweetLoading;

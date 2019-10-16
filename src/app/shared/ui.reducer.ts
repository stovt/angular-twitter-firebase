import { UIActions, START_LOADING_USERS, STOP_LOADING_USERS } from './ui.actions';

export interface State {
  isUsersLoading: boolean;
}

const initialState: State = {
  isUsersLoading: false
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
    default:
      return state;
  }
}

export const getIsUsersLoading = (state: State) => state.isUsersLoading;

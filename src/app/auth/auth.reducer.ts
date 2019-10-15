import {
  AuthActions,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
  SET_USERS
} from './auth.actions';

import { User } from './user.model';

export interface State {
  user: User;
  isAuthenticated: boolean;
  users: User[];
}

const initialState: State = {
  user: null,
  isAuthenticated: false,
  users: []
};

export function authReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true
      };
    case SET_UNAUTHENTICATED:
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };

    case SET_USERS:
      return {
        ...state,
        users: action.payload
      };
    default:
      return state;
  }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
export const getUser = (state: State) => state.user;
export const getUsers = (state: State) => state.users;

import {
  AuthActions,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
  SET_USERS,
  SET_USER_BY_ID
} from './auth.actions';

import { User } from './user.model';

export interface State {
  user: User;
  isAuthenticated: boolean;
  users: User[];
  usersById: Record<string, User>;
}

const initialState: State = {
  user: null,
  isAuthenticated: false,
  users: [],
  usersById: {}
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
    case SET_USER_BY_ID:
      return {
        ...state,
        usersById: {
          ...state.usersById,
          [action.payload.id]: action.payload.user
        }
      };
    default:
      return state;
  }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
export const getUser = (state: State) => state.user;
export const getUsers = (state: State) => state.users;
export const getUserById = (id: string) => (state: State) => state.usersById[id] || null;

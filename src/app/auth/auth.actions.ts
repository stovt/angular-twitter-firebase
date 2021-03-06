import { Action } from '@ngrx/store';

import { User } from './user.model';

export const SET_AUTHENTICATED = '[Auth] Set Authenticated';
export const SET_UNAUTHENTICATED = '[Auth] Set Unauthenticated';
export const SET_USER = '[Auth] Set User';
export const SET_USERS = '[Auth] Set Users';
export const SET_USER_BY_ID = '[Auth] Set User By Id';

export class SetAuthenticated implements Action {
  readonly type = SET_AUTHENTICATED;
}

export class SetUnauthenticated implements Action {
  readonly type = SET_UNAUTHENTICATED;
}

export class SetUser implements Action {
  readonly type = SET_USER;

  constructor(public payload: User) {}
}

export class SetUsers implements Action {
  readonly type = SET_USERS;

  constructor(public payload: User[]) {}
}

export class SetUserById implements Action {
  readonly type = SET_USER_BY_ID;

  constructor(public payload: { id: string; user: User }) {}
}

export type AuthActions = SetAuthenticated | SetUnauthenticated | SetUser | SetUsers | SetUserById;

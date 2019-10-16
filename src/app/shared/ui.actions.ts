import { Action } from '@ngrx/store';

export const START_LOADING_USERS = '[UI] Start Loading Users';
export const STOP_LOADING_USERS = '[UI] Stop Loading Users';

export class StartLoadingUsers implements Action {
  readonly type = START_LOADING_USERS;
}

export class StopLoadingUsers implements Action {
  readonly type = STOP_LOADING_USERS;
}

export type UIActions = StartLoadingUsers | StopLoadingUsers;

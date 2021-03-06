import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';
import * as fromTweet from './tweet/tweet.reducer';

export interface State {
  ui: fromUi.State;
  auth: fromAuth.State;
  tweet: fromTweet.State;
}

export const reducers: ActionReducerMap<State> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer,
  tweet: fromTweet.tweetReducer
};

/* UI reducer */
export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsUsersLoading = createSelector(
  getUiState,
  fromUi.getIsUsersLoading
);
export const getIsTweetLoading = createSelector(
  getUiState,
  fromUi.getIsTweetLoading
);
export const getIsAllTweetsLoading = createSelector(
  getUiState,
  fromUi.getIsAllTweetsLoading
);
export const getIsTweetsByUserIdLoading = (userId: string) =>
  createSelector(
    getUiState,
    fromUi.getIsTweetsByUserIdLoading(userId)
  );
export const getIsUserLoading = (id: string) =>
  createSelector(
    getUiState,
    fromUi.getIsUserLoading(id)
  );
export const getIsCommentByTweetIdLoading = (tweetId: string) =>
  createSelector(
    getUiState,
    fromUi.getIsCommentByTweetIdLoading(tweetId)
  );
export const getIsCommentsByTweetIdLoading = (tweetId: string) =>
  createSelector(
    getUiState,
    fromUi.getIsCommentsByTweetIdLoading(tweetId)
  );
export const getIsProfileSettingsLoading = createSelector(
  getUiState,
  fromUi.getIsProfileSettingsLoading
);

/* Auth reducer */
export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuth = createSelector(
  getAuthState,
  fromAuth.getIsAuth
);
export const getUser = createSelector(
  getAuthState,
  fromAuth.getUser
);
export const getUsers = createSelector(
  getAuthState,
  fromAuth.getUsers
);
export const getUserById = (id: string) =>
  createSelector(
    getAuthState,
    fromAuth.getUserById(id)
  );

/* Tweet reducer */
export const getTweetState = createFeatureSelector<fromTweet.State>('tweet');
export const getAllTweets = createSelector(
  getTweetState,
  fromTweet.getAllTweets
);
export const getAllTweetsCursor = createSelector(
  getTweetState,
  fromTweet.getAllTweetsCursor
);
export const getIsAllTweetsLoaded = createSelector(
  getTweetState,
  fromTweet.getIsAllTweetsLoaded
);
export const getUserTweets = (userId: string) =>
  createSelector(
    getTweetState,
    fromTweet.getUserTweets(userId)
  );
export const getUserTweetsCursor = (userId: string) =>
  createSelector(
    getTweetState,
    fromTweet.getUserTweetsCursor(userId)
  );
export const getIsUserTweetsLoaded = (userId: string) =>
  createSelector(
    getTweetState,
    fromTweet.getIsUserTweetsLoaded(userId)
  );
export const getTweetComments = (tweetId: string) =>
  createSelector(
    getTweetState,
    fromTweet.getTweetComments(tweetId)
  );

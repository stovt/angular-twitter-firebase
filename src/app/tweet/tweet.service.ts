import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { Tweet } from './tweet.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as TweetActions from './tweet.actions';
import * as fromRoot from '../app.reducer';

@Injectable({ providedIn: 'root' })
export class TweetService {
  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  tweet(body: string, resetFormCallback: () => void) {
    this.store.dispatch(new UI.StartLoadingTweet());
    this.store
      .select(fromRoot.getUser)
      .pipe(take(1))
      .subscribe(user => {
        this.db
          .collection('tweets')
          .add({
            body,
            createdAt: firestore.FieldValue.serverTimestamp(),
            createdAtLocal: new Date(),
            user,
            likes: [],
            childrenAmount: 0,
            parentId: null
          })
          .then(() => {
            resetFormCallback();
            this.store.dispatch(new UI.StopLoadingTweet());
          })
          .catch(error => {
            this.store.dispatch(new UI.StopLoadingTweet());
            this.uiService.showErrorSnackBar(error.message);
          });
      });
  }

  commentTweet(parentId: string, body: string, resetFormCallback: () => void) {
    const increment = firestore.FieldValue.increment(1);

    const batch = this.db.firestore.batch();

    const newTweetRef = this.db.firestore.collection('tweets').doc();
    const parentTweetRef = this.db.firestore.collection('tweets').doc(parentId);

    this.store.dispatch(new UI.StartLoadingComment(parentId));
    this.store
      .select(fromRoot.getUser)
      .pipe(take(1))
      .subscribe(user => {
        batch.set(newTweetRef, {
          body,
          createdAt: firestore.FieldValue.serverTimestamp(),
          createdAtLocal: new Date(),
          user,
          likes: [],
          childrenAmount: 0,
          parentId
        });
        batch.update(parentTweetRef, { childrenAmount: increment });

        batch
          .commit()
          .then(() => {
            resetFormCallback();
            this.store.dispatch(new UI.StopLoadingComment(parentId));
          })
          .catch(error => {
            this.store.dispatch(new UI.StopLoadingComment(parentId));
            this.uiService.showErrorSnackBar(error.message);
          });
      });
  }

  fetchAllTweets(limit: number = 10) {
    this.store.dispatch(new UI.StartLoadingAllTweets());
    this.store
      .select(fromRoot.getAllTweetsCursor)
      .pipe(take(1))
      .subscribe(cursor => {
        let tweets$: Observable<DocumentChangeAction<Tweet>[]>;
        if (cursor) {
          tweets$ = this.db
            .collection<Tweet>('tweets', ref =>
              ref
                .where('parentId', '==', null)
                .limit(limit)
                .orderBy('createdAt', 'desc')
                .startAfter(cursor)
            )
            .stateChanges();
        } else {
          tweets$ = this.db
            .collection<Tweet>('tweets', ref =>
              ref
                .where('parentId', '==', null)
                .limit(limit)
                .orderBy('createdAt', 'desc')
            )
            .stateChanges();
        }

        tweets$.pipe(map(actions => this.handleTweetsData(actions))).subscribe(
          actions => {
            if (this.isTweetsLoaded(actions, limit)) {
              this.store.dispatch(new TweetActions.SetAllTweetsDone());
            }
            actions.forEach(action => {
              this.store.dispatch({
                type: `[Tweet] All Tweets ${action.type}`,
                payload: action.payload
              });
            });
            this.store.dispatch(new UI.StopLoadingAllTweets());
          },
          error => {
            this.uiService.showErrorSnackBar(error.message);
            this.store.dispatch(new UI.StopLoadingAllTweets());
          }
        );
      });
  }

  fetchUserTweets(userId: string, limit: number = 10) {
    this.store.dispatch(new UI.StartLoadingUserTweets(userId));
    this.store
      .select(fromRoot.getUserTweetsCursor(userId))
      .pipe(take(1))
      .subscribe(cursor => {
        let tweets$: Observable<DocumentChangeAction<Tweet>[]>;
        if (cursor) {
          tweets$ = this.db
            .collection<Tweet>('tweets', ref =>
              ref
                .where('parentId', '==', null)
                .where('user.userId', '==', userId)
                .limit(limit)
                .orderBy('createdAt', 'desc')
                .startAfter(cursor)
            )
            .stateChanges();
        } else {
          tweets$ = this.db
            .collection<Tweet>('tweets', ref =>
              ref
                .where('parentId', '==', null)
                .where('user.userId', '==', userId)
                .limit(limit)
                .orderBy('createdAt', 'desc')
            )
            .stateChanges();
        }

        tweets$.pipe(map(actions => this.handleTweetsData(actions))).subscribe(
          actions => {
            if (this.isTweetsLoaded(actions, limit)) {
              this.store.dispatch(new TweetActions.SetUserTweetsDone(userId));
            }
            actions.forEach(action => {
              this.store.dispatch({
                type: `[Tweet] User Tweets ${action.type}`,
                payload: {
                  ...action.payload,
                  userId
                }
              });
            });
            this.store.dispatch(new UI.StopLoadingUserTweets(userId));
          },
          error => {
            this.uiService.showErrorSnackBar(error.message);
            this.store.dispatch(new UI.StopLoadingUserTweets(userId));
          }
        );
      });
  }

  fetchTweetComments(tweetId: string) {
    this.store.dispatch(new UI.StartLoadingComments(tweetId));
    this.db
      .collection<Tweet>('tweets', ref =>
        ref.where('parentId', '==', tweetId).orderBy('createdAt', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            const id = doc.payload.doc.id;
            const data = {
              ...doc.payload.doc.data(),
              createdAt: doc.payload.doc.data().createdAt || doc.payload.doc.data().createdAtLocal
            };
            return { id, ...data };
          });
        })
      )
      .subscribe(
        comments => {
          this.store.dispatch(new UI.StopLoadingComments(tweetId));
          this.store.dispatch(new TweetActions.SetTweetComments({ tweetId, comments }));
        },
        error => {
          this.store.dispatch(new UI.StopLoadingComments(tweetId));
          this.uiService.showErrorSnackBar(error.message);
        }
      );
  }

  likeTweet(id: string, likes: string[]) {
    return this.db
      .doc<Tweet>(`tweets/${id}`)
      .update({ likes })
      .catch(e => this.uiService.showErrorSnackBar(e.message));
  }

  removeTweet(id: string) {
    return this.db
      .doc<Tweet>(`tweets/${id}`)
      .delete()
      .catch(e => this.uiService.showErrorSnackBar(e.message));
  }

  private handleTweetsData(actions: DocumentChangeAction<Tweet>[]) {
    return actions.map(action => {
      const id = action.payload.doc.id;
      const data = {
        ...action.payload.doc.data(),
        createdAt: action.payload.doc.data().createdAt || action.payload.doc.data().createdAtLocal
      };
      const doc = action.payload.doc;
      return {
        ...action,
        payload: {
          tweet: { id, ...data },
          doc
        }
      };
    });
  }

  private isTweetsLoaded(
    actions: {
      payload: {
        tweet: Tweet;
        doc: QueryDocumentSnapshot<Tweet>;
      };
      type: firestore.DocumentChangeType;
    }[],
    limit: number
  ) {
    const isAddingActions =
      actions.filter(action => action.type === 'added').length === actions.length;
    if (isAddingActions && actions.length < limit) {
      return true;
    }
    return false;
  }
}

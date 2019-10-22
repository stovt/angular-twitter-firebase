import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { firestore } from 'firebase/app';
import { Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { Tweet } from './tweet.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as TweetActions from './tweet.actions';
import * as fromRoot from '../app.reducer';

@Injectable({ providedIn: 'root' })
export class TweetService {
  private fbSubs: Subscription[] = [];

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
            createdAt: new Date(),
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
            this.uiService.showSnackBar(error.message);
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
          createdAt: new Date(),
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
            this.uiService.showSnackBar(error.message);
          });
      });
  }

  fetchAllTweets() {
    this.store.dispatch(new UI.StartLoadingAllTweets());
    this.fbSubs.push(
      this.db
        .collection<Tweet>('tweets', ref =>
          ref.where('parentId', '==', null).orderBy('createdAt', 'desc')
        )
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              const id = doc.payload.doc.id;
              const data = doc.payload.doc.data();
              return { id, ...data };
            });
          })
        )
        .subscribe(
          tweets => {
            this.store.dispatch(new UI.StopLoadingAllTweets());
            this.store.dispatch(new TweetActions.SetAllTweets(tweets));
          },
          error => {
            this.store.dispatch(new UI.StopLoadingAllTweets());
            this.uiService.showSnackBar(error.message);
          }
        )
    );
  }

  fetchUserTweets(userId: string) {
    this.store.dispatch(new UI.StartLoadingUserTweets(userId));
    this.fbSubs.push(
      this.db
        .collection<Tweet>('tweets', ref =>
          ref
            .where('parentId', '==', null)
            .where('user.userId', '==', userId)
            .orderBy('createdAt', 'desc')
        )
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              const id = doc.payload.doc.id;
              const data = doc.payload.doc.data();
              return { id, ...data };
            });
          })
        )
        .subscribe(
          tweets => {
            this.store.dispatch(new UI.StopLoadingUserTweets(userId));
            this.store.dispatch(new TweetActions.SetUserTweets({ userId, tweets }));
          },
          error => {
            this.store.dispatch(new UI.StopLoadingUserTweets(userId));
            this.uiService.showSnackBar(error.message);
          }
        )
    );
  }

  fetchTweetComments(tweetId: string) {
    this.store.dispatch(new UI.StartLoadingComments(tweetId));
    this.fbSubs.push(
      this.db
        .collection<Tweet>('tweets', ref =>
          ref.where('parentId', '==', tweetId).orderBy('createdAt', 'desc')
        )
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              const id = doc.payload.doc.id;
              const data = doc.payload.doc.data();
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
            this.uiService.showSnackBar(error.message);
          }
        )
    );
  }

  likeTweet(id: string, likes: string[]) {
    return this.db
      .doc<Tweet>(`tweets/${id}`)
      .update({ likes })
      .catch(e => this.uiService.showSnackBar(e.message));
  }

  removeTweet(id: string) {
    return this.db
      .doc<Tweet>(`tweets/${id}`)
      .delete()
      .catch(e => this.uiService.showSnackBar(e.message));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}

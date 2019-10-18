import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { Tweet } from './tweet.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as TweetActions from '../tweet/tweet.actions';
import * as fromRoot from '../app.reducer';

@Injectable({ providedIn: 'root' })
export class TweetService {
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  tweet(body: string) {
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
          .then(() => this.store.dispatch(new UI.StopLoadingTweet()))
          .catch(error => {
            this.store.dispatch(new UI.StopLoadingTweet());
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
            return docArray.map(doc => ({
              id: doc.payload.doc.id,
              body: doc.payload.doc.data().body,
              createdAt: doc.payload.doc.data().createdAt,
              user: doc.payload.doc.data().user,
              likes: doc.payload.doc.data().likes,
              childrenAmount: doc.payload.doc.data().childrenAmount,
              parentId: doc.payload.doc.data().parentId
            }));
          })
        )
        .subscribe(
          tweets => {
            this.store.dispatch(new UI.StopLoadingAllTweets());
            this.store.dispatch(new TweetActions.SetAllTweets(tweets));
          },
          () => {
            this.store.dispatch(new UI.StopLoadingAllTweets());
            this.uiService.showSnackBar('Fetching Tweets failed, please try anain later');
          }
        )
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}

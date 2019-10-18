import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
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
            childrenAmount: 0
          })
          .then(() => this.store.dispatch(new UI.StopLoadingTweet()))
          .catch(error => {
            this.store.dispatch(new UI.StopLoadingTweet());
            this.uiService.showSnackBar(error.message);
          });
      });
  }
}

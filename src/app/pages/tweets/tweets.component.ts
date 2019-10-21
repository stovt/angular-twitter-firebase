import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Tweet } from '../../tweet/tweet.model';
import { TweetService } from '../../tweet/tweet.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit, OnDestroy {
  tweets: Tweet[];
  isLoading$: Observable<boolean>;

  tweetsSub: Subscription;

  constructor(private store: Store<fromRoot.State>, private tweetService: TweetService) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsAllTweetsLoading);
    this.tweetsSub = this.store
      .select(fromRoot.getAllTweets)
      .subscribe(tweets => (this.tweets = tweets));
    if (!this.tweets.length) {
      this.tweetService.fetchAllTweets();
    }
  }

  ngOnDestroy(): void {
    if (this.tweetsSub) {
      this.tweetsSub.unsubscribe();
    }
  }
}

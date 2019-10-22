import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { User } from '../../auth/user.model';
import { Tweet } from '../../tweet/tweet.model';
import { TweetService } from '../../tweet/tweet.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  user: User;
  tweets: Tweet[];
  isLoading$: Observable<boolean>;

  userSub: Subscription;
  tweetsSub: Subscription;

  constructor(private store: Store<fromRoot.State>, private tweetService: TweetService) {}

  ngOnInit() {
    this.userSub = this.store.select(fromRoot.getUser).subscribe(user => {
      this.user = user;
      if (user) {
        this.isLoading$ = this.store.select(fromRoot.getIsTweetsByUserIdLoading(user.userId));
        this.tweetsSub = this.store
          .select(fromRoot.getUserTweets(user.userId))
          .subscribe(tweets => (this.tweets = tweets));
        if (!this.tweets.length) {
          this.tweetService.fetchUserTweets(user.userId);
        }
      }
    });
  }

  trackTweet(index: number, item: Tweet) {
    return item ? item.id : undefined;
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.tweetsSub) {
      this.tweetsSub.unsubscribe();
    }
  }
}

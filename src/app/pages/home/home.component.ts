import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../auth/user.model';
import { Tweet } from '../../tweet/tweet.model';
import { TweetService } from '../../tweet/tweet.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;
  isLoading$: Observable<boolean>;
  tweets: Tweet[];

  constructor(private store: Store<fromRoot.State>, private tweetService: TweetService) {}

  ngOnInit() {
    this.store.select(fromRoot.getUser).subscribe(user => {
      this.user = user;
      if (user) {
        this.isLoading$ = this.store.select(fromRoot.getIsTweetsByUserIdLoading(user.userId));
        this.store
          .select(fromRoot.getUserTweets(user.userId))
          .subscribe(tweets => (this.tweets = tweets));
        if (!this.tweets.length) {
          this.tweetService.fetchUserTweets(user.userId);
        }
      }
    });
  }
}

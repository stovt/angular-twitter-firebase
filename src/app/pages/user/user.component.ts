import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../auth/user.model';
import { Tweet } from '../../tweet/tweet.model';
import { AuthService } from '../../auth/auth.service';
import { TweetService } from '../../tweet/tweet.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User;
  isUserLoading$: Observable<boolean>;
  isTweetsLoading$: Observable<boolean>;
  tweets: Tweet[];

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private tweetService: TweetService
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');

    this.isUserLoading$ = this.store.select(fromRoot.getIsUserLoading(userId));
    this.store.select(fromRoot.getUserById(userId)).subscribe(user => {
      this.user = user;
      if (!user) {
        this.authService.fetchUser(userId);
      }
    });

    this.isTweetsLoading$ = this.store.select(fromRoot.getIsTweetsByUserIdLoading(userId));
    this.store.select(fromRoot.getUserTweets(userId)).subscribe(tweets => (this.tweets = tweets));
    if (!this.tweets.length) {
      this.tweetService.fetchUserTweets(userId);
    }
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

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
export class UserComponent implements OnInit, OnDestroy {
  user: User;
  tweets: Tweet[];

  isUserLoading$: Observable<boolean>;
  isTweetsLoading$: Observable<boolean>;

  authUserSub: Subscription;
  userSub: Subscription;
  tweetsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private tweetService: TweetService
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    this.authUserSub = this.store.select(fromRoot.getUser).subscribe(user => {
      if (user.userId === userId) {
        this.router.navigate(['/']);
      }
    });

    this.isUserLoading$ = this.store.select(fromRoot.getIsUserLoading(userId));
    this.userSub = this.store.select(fromRoot.getUserById(userId)).subscribe(user => {
      this.user = user;
      if (!user) {
        this.authService.fetchUser(userId);
      }
    });

    this.isTweetsLoading$ = this.store.select(fromRoot.getIsTweetsByUserIdLoading(userId));
    this.tweetsSub = this.store
      .select(fromRoot.getUserTweets(userId))
      .subscribe(tweets => (this.tweets = tweets));
    if (!this.tweets.length) {
      this.tweetService.fetchUserTweets(userId);
    }
  }

  trackTweet(index: number, item: Tweet) {
    return item ? item.id : undefined;
  }

  ngOnDestroy() {
    if (this.authUserSub) {
      this.authUserSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.tweetsSub) {
      this.tweetsSub.unsubscribe();
    }
  }
}

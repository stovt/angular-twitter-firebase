import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/overlay';
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
  tweets: Tweet[] = [];

  isUserLoading$: Observable<boolean>;
  isTweetsLoading: boolean;
  isTweetsDone: boolean;

  authUserSub: Subscription;
  userSub: Subscription;
  tweetsSub: Subscription;
  tweetsLoadingSub: Subscription;
  tweetsDoneSub: Subscription;
  scrollingSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private tweetService: TweetService,
    private scroll: ScrollDispatcher,
    private cdr: ChangeDetectorRef
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

    this.tweetsLoadingSub = this.store
      .select(fromRoot.getIsTweetsByUserIdLoading(userId))
      .subscribe(isTweetsLoading => {
        this.isTweetsLoading = isTweetsLoading;
        this.cdr.detectChanges();
      });
    this.tweetsDoneSub = this.store
      .select(fromRoot.getIsUserTweetsLoaded(userId))
      .subscribe(isTweetsDone => {
        this.isTweetsDone = isTweetsDone;
        this.cdr.detectChanges();
      });

    this.tweetsSub = this.store
      .select(fromRoot.getUserTweets(userId))
      .subscribe(tweets => (this.tweets = tweets));

    if (!this.tweets.length) {
      this.tweetService.fetchUserTweets(userId);
    }

    this.scrollingSub = this.scroll.scrolled().subscribe((data: CdkScrollable) => {
      const el = data.getElementRef().nativeElement;

      const top = el.scrollTop || 0;
      const height = el.scrollHeight;
      const offset = el.offsetHeight;

      if (top > height - offset - 1 && !this.isTweetsLoading && !this.isTweetsDone) {
        this.tweetService.fetchUserTweets(userId);
        el.scrollTop = height;
      }
    });
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
    if (this.tweetsLoadingSub) {
      this.tweetsLoadingSub.unsubscribe();
    }
    if (this.tweetsDoneSub) {
      this.tweetsDoneSub.unsubscribe();
    }
    if (this.scrollingSub) {
      this.scrollingSub.unsubscribe();
    }
  }
}

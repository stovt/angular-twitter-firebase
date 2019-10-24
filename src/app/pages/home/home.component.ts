import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

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
  tweets: Tweet[] = [];
  isLoading: boolean;
  isDone: boolean;

  userSub: Subscription;
  tweetsSub: Subscription;
  loadingSub: Subscription;
  doneSub: Subscription;
  scrollingSub: Subscription;

  constructor(
    private store: Store<fromRoot.State>,
    private tweetService: TweetService,
    private scroll: ScrollDispatcher,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userSub = this.store.select(fromRoot.getUser).subscribe(user => {
      this.user = user;
      if (user) {
        this.loadingSub = this.store
          .select(fromRoot.getIsTweetsByUserIdLoading(user.userId))
          .subscribe(isLoading => {
            this.isLoading = isLoading;
            this.cdr.detectChanges();
          });
        this.doneSub = this.store
          .select(fromRoot.getIsUserTweetsLoaded(user.userId))
          .subscribe(isDone => {
            this.isDone = isDone;
            this.cdr.detectChanges();
          });
        this.tweetsSub = this.store
          .select(fromRoot.getUserTweets(user.userId))
          .subscribe(tweets => {
            this.tweets = tweets;
          });

        if (!this.tweets.length) {
          this.tweetService.fetchUserTweets(user.userId);
        }

        this.scrollingSub = this.scroll.scrolled().subscribe((data: CdkScrollable) => {
          const el = data.getElementRef().nativeElement;

          const top = el.scrollTop || 0;
          const height = el.scrollHeight;
          const offset = el.offsetHeight;

          if (top > height - offset - 1 && !this.isLoading && !this.isDone) {
            this.tweetService.fetchUserTweets(user.userId);
            el.scrollTop = height;
          }
        });
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
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
    if (this.doneSub) {
      this.doneSub.unsubscribe();
    }
    if (this.scrollingSub) {
      this.scrollingSub.unsubscribe();
    }
  }
}

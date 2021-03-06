import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

import { Tweet } from '../../tweet/tweet.model';
import { TweetService } from '../../tweet/tweet.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit, OnDestroy {
  tweets: Tweet[] = [];
  isLoading: boolean;
  isDone: boolean;

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
    this.loadingSub = this.store.select(fromRoot.getIsAllTweetsLoading).subscribe(isLoading => {
      this.isLoading = isLoading;
      this.cdr.detectChanges();
    });
    this.doneSub = this.store.select(fromRoot.getIsAllTweetsLoaded).subscribe(isDone => {
      this.isDone = isDone;
      this.cdr.detectChanges();
    });
    this.tweetsSub = this.store.select(fromRoot.getAllTweets).subscribe(tweets => {
      this.tweets = tweets;
    });

    if (!this.tweets.length) {
      this.tweetService.fetchAllTweets();
    }

    this.scrollingSub = this.scroll.scrolled().subscribe((data: CdkScrollable) => {
      const el = data.getElementRef().nativeElement;

      const top = el.scrollTop || 0;
      const height = el.scrollHeight;
      const offset = el.offsetHeight;

      if (top > height - offset - 1 && !this.isLoading && !this.isDone) {
        this.tweetService.fetchAllTweets();
        el.scrollTop = height;
      }
    });
  }

  trackTweet(index: number, item: Tweet) {
    return item ? item.id : undefined;
  }

  ngOnDestroy(): void {
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

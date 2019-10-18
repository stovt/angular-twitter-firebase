import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Tweet } from '../../tweet/tweet.model';
import { TweetService } from '../../tweet/tweet.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit {
  isLoading$: Observable<boolean>;
  tweets: Tweet[];

  constructor(private store: Store<fromRoot.State>, private tweetService: TweetService) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsAllTweetsLoading);
    this.store.select(fromRoot.getAllTweets).subscribe(tweets => {
      this.tweets = tweets;
      if (!tweets.length) {
        this.tweetService.fetchAllTweets();
      }
    });
  }
}

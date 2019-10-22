import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Tweet } from '../../tweet/tweet.model';
import { TweetService } from '../../tweet/tweet.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-tweet-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() tweetId: string;

  comments: Tweet[];
  isLoading$: Observable<boolean>;

  commentsSub: Subscription;

  constructor(private store: Store<fromRoot.State>, private tweetService: TweetService) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsCommentsByTweetIdLoading(this.tweetId));
    this.commentsSub = this.store
      .select(fromRoot.getTweetComments(this.tweetId))
      .subscribe(comments => (this.comments = comments));

    if (!this.comments.length) {
      this.tweetService.fetchTweetComments(this.tweetId);
    }
  }

  trackComment(index: number, item: Tweet) {
    return item ? item.id : undefined;
  }

  ngOnDestroy() {
    if (this.commentsSub) {
      this.commentsSub.unsubscribe();
    }
  }
}

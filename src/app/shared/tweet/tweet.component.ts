import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { formatDistanceToNow } from 'date-fns';

import { Tweet } from '../../tweet/tweet.model';
import { User } from '../../auth/user.model';
import { TweetService } from '../../tweet/tweet.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tweet: Tweet;

  user: User;
  userSub: Subscription;

  isLiked = false;
  canRemove = false;
  showComments = false;

  isTweetLiking = false;
  isTweetRemoving = false;

  constructor(private store: Store<fromRoot.State>, private tweetService: TweetService) {}

  ngOnInit() {
    this.userSub = this.store.select(fromRoot.getUser).subscribe(user => {
      this.user = user;
      if (user) {
        this.isLiked = this.tweet.likes.indexOf(user.userId) !== -1;
        this.canRemove = user.userId === this.tweet.user.userId;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.user) {
      this.isLiked = changes.tweet.currentValue.likes.indexOf(this.user.userId) !== -1;
    }
  }

  onLikeTweet() {
    this.isTweetLiking = true;

    let likes: string[];
    if (this.isLiked) {
      likes = this.tweet.likes.filter(userId => userId !== this.user.userId);
    } else {
      likes = [...this.tweet.likes, this.user.userId];
    }

    this.tweetService
      .likeTweet(this.tweet.id, likes)
      .then(() => (this.isTweetLiking = false))
      .catch(() => (this.isTweetLiking = false));
  }

  onRemoveTweet() {
    this.isTweetRemoving = true;
    this.tweetService
      .removeTweet(this.tweet.id)
      .then(() => (this.isTweetRemoving = false))
      .catch(() => (this.isTweetRemoving = false));
  }

  onToggleComments() {
    this.showComments = !this.showComments;
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  get date() {
    return formatDistanceToNow(this.tweet.createdAt.toDate());
  }
}

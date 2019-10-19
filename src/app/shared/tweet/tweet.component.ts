import { Component, Input, OnInit } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { Store } from '@ngrx/store';

import { Tweet } from '../../tweet/tweet.model';
import { User } from '../../auth/user.model';
import { TweetService } from '../../tweet/tweet.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {
  @Input() tweet: Tweet;

  user: User;

  isLiked = false;
  canRemove = false;

  isTweetLiking = false;
  isTweetRemoving = false;

  constructor(private store: Store<fromRoot.State>, private tweetService: TweetService) {}

  ngOnInit() {
    this.store.select(fromRoot.getUser).subscribe(user => {
      this.user = user;
      if (user) {
        this.isLiked = this.tweet.likes.indexOf(user.userId) !== -1;
        this.canRemove = user.userId === this.tweet.user.userId;
      }
    });
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

  get date() {
    return formatDistanceToNow(this.tweet.createdAt.toDate());
  }
}

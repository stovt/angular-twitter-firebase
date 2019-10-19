import { Component, Input, OnInit } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { Store } from '@ngrx/store';

import { Tweet } from '../../tweet/tweet.model';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {
  @Input() tweet: Tweet;

  isLiked = false;
  canRemove = false;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.store.select(fromRoot.getUser).subscribe(user => {
      if (user) {
        this.isLiked = this.tweet.likes.indexOf(user.userId) !== -1;
        this.canRemove = user.userId === this.tweet.user.userId;
      }
    });
  }

  get date() {
    return formatDistanceToNow(this.tweet.createdAt.toDate());
  }
}

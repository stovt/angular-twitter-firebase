import { Component, Input, OnInit } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

import { Tweet } from '../../../tweet/tweet.model';

@Component({
  selector: 'app-tweet-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Tweet;

  constructor() {}

  ngOnInit() {}

  get date() {
    return formatDistanceToNow(this.comment.createdAt.toDate());
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

import { Tweet } from '../../tweet/tweet.model';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {
  @Input() tweet: Tweet;

  constructor() {}

  ngOnInit() {}

  get date() {
    return formatDistanceToNow(this.tweet.createdAt.toDate());
  }
}

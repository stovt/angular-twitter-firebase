import { Component, Input, OnInit } from '@angular/core';

import { Tweet } from '../tweet.model';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit {
  @Input() tweet: Tweet;

  constructor() {}

  ngOnInit() {}
}

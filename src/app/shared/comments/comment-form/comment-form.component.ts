import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import * as fromRoot from '../../../app.reducer';
import { TweetService } from '../../../tweet/tweet.service';

@Component({
  selector: 'app-tweet-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {
  @Input() tweetId: string;

  @ViewChild('f', { static: false }) tweetNgForm: NgForm;

  isLoading$: Observable<boolean>;
  commentForm: FormGroup;

  constructor(private store: Store<fromRoot.State>, private tweetService: TweetService) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsCommentByTweetIdLoading(this.tweetId));
    this.commentForm = new FormGroup({
      body: new FormControl('', [Validators.required])
    });
  }

  onSubmit({ body }: { body: string }) {
    this.tweetService.commentTweet(this.tweetId, body.replace(/\r?\n/g, '<br/>'), () =>
      this.tweetNgForm.resetForm()
    );
  }
}

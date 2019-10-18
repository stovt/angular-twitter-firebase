import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import * as fromRoot from '../../app.reducer';
import { TweetService } from '../../tweet/tweet.service';

@Component({
  selector: 'app-tweet-form',
  templateUrl: './tweet-form.component.html',
  styleUrls: ['./tweet-form.component.css']
})
export class TweetFormComponent implements OnInit {
  @ViewChild('f', { static: false }) tweetNgForm: NgForm;

  isLoading$: Observable<boolean>;
  tweetForm: FormGroup;

  constructor(private store: Store<fromRoot.State>, private tweetService: TweetService) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsTweetLoading);
    this.tweetForm = new FormGroup({
      body: new FormControl('', [Validators.required])
    });
  }

  onSubmit({ body }: { body: string }) {
    this.tweetService.tweet(body.replace(/\r?\n/g, '<br/>'), () => this.tweetNgForm.resetForm());
  }
}

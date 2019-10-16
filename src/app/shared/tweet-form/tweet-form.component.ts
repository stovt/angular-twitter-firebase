import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tweet-form',
  templateUrl: './tweet-form.component.html',
  styleUrls: ['./tweet-form.component.css']
})
export class TweetFormComponent implements OnInit {
  tweetForm: FormGroup;
  isLoading = false;

  constructor() {}

  ngOnInit() {
    this.tweetForm = new FormGroup({
      body: new FormControl('', [Validators.required])
    });
  }

  onSubmit({ body }: { body: string }) {
    this.isLoading = true;
    console.log(body.replace(/\r?\n/g, '<br/>'));
    /*
    this.authService
      .signInWithEmailAndPassword({ email, password })
      .then(() => (this.isLoading = false));
    */
  }
}

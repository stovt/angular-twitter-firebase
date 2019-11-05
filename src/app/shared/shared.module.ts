import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { TweetComponent } from './tweet/tweet.component';
import { TweetFormComponent } from './tweet-form/tweet-form.component';
import { CommentsComponent } from './comments/comments.component';
import { CommentFormComponent } from './comments/comment-form/comment-form.component';
import { CommentComponent } from './comments/comment/comment.component';
import { EmptyPlaceholderComponent } from './empty-placeholder/empty-placeholder.component';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule, FlexLayoutModule],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    LoadingSpinnerComponent,
    TweetComponent,
    TweetFormComponent,
    EmptyPlaceholderComponent
  ],
  declarations: [
    LoadingSpinnerComponent,
    TweetComponent,
    TweetFormComponent,
    CommentsComponent,
    CommentFormComponent,
    CommentComponent,
    EmptyPlaceholderComponent,
    SnackbarComponent
  ],
  entryComponents: [SnackbarComponent]
})
export class SharedModule {}

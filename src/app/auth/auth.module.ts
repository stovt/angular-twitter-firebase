import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';

@NgModule({
  declarations: [SignupComponent, SigninComponent],
  imports: [ReactiveFormsModule]
})
export class AuthModule {}

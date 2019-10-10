import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';

@NgModule({
  declarations: [SignupComponent, SigninComponent],
  imports: [ReactiveFormsModule, AuthRoutingModule, SharedModule]
})
export class AuthModule {}

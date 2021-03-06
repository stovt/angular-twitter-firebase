import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { SigninSocialComponent } from './signin-social/signin-social.component';
import { GoogleComponent } from './signin-social/google/google.component';
import { FacebookComponent } from './signin-social/facebook/facebook.component';
import { GithubComponent } from './signin-social/github/github.component';

@NgModule({
  declarations: [
    SignupComponent,
    SigninComponent,
    SigninSocialComponent,
    GoogleComponent,
    FacebookComponent,
    GithubComponent
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireAuthModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule {}

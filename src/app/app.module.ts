import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { StoreModule } from '@ngrx/store';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { TweetsComponent } from './pages/tweets/tweets.component';
import { UserComponent } from './pages/user/user.component';
import { reducers } from './app.reducer';
import { ProfileImageComponent } from './navigation/header/profile-image/profile-image.component';
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';
import { ConfirmationDialogComponent } from './pages/profile-settings/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SidenavListComponent,
    ProfileImageComponent,
    UsersComponent,
    TweetsComponent,
    UserComponent,
    ProfileSettingsComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    SharedModule,
    AuthModule
  ],
  entryComponents: [ConfirmationDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

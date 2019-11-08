import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { of, Subscription, Subject } from 'rxjs';
import { switchMap, finalize, first } from 'rxjs/operators';

import { User } from './user.model';
import { SignInAuthData, SignUpAuthData, ProfileSettingsData } from './auth-data.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';
import * as TweetActions from '../tweet/tweet.actions';
import * as fromRoot from '../app.reducer';
import { TweetService } from '../tweet/tweet.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private fbSubs: Subscription[] = [];

  public authChecked = new Subject<boolean>();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private router: Router,
    private uiService: UIService,
    private store: Store<fromRoot.State>,
    private tweetService: TweetService
  ) {}

  initAuthListener() {
    this.afAuth.authState
      .pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      )
      .subscribe((user: User) => {
        if (user) {
          this.store.dispatch(new Auth.SetUser(user));
          this.store.dispatch(new Auth.SetAuthenticated());
        } else {
          this.tweetService.cancelSubscriptions();
          this.store.dispatch(new Auth.SetUnauthenticated());
          this.store.dispatch(new TweetActions.Reset());
          this.router.navigate(['/signin']);
        }
        this.authChecked.next(true);
      });
  }

  signUpWithEmailAndPassword(authData: SignUpAuthData) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(credential => {
        this.updateUserData({
          ...credential.user,
          displayName: `${authData.firstName} ${authData.lastName}`,
          phoneNumber: authData.phone
        });
        this.router.navigate(['/']);
      })
      .catch(error => this.uiService.showErrorSnackBar(error.message));
  }

  signInWithEmailAndPassword(authData: SignInAuthData) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => this.router.navigate(['/']))
      .catch(error => this.uiService.showErrorSnackBar(error.message));
  }

  signInWithFacebook() {
    const provider = new auth.FacebookAuthProvider();
    this.socialSignIn(provider);
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.socialSignIn(provider);
  }

  signInWithGithub() {
    const provider = new auth.GithubAuthProvider();
    this.socialSignIn(provider);
  }

  signOut() {
    this.afAuth.auth.signOut().catch(error => this.uiService.showErrorSnackBar(error.message));
  }

  deleteUser() {
    return this.afAuth.auth.currentUser
      .delete()
      .then(() => this.uiService.showSuccessSnackBar('The profile has been deleted'))
      .catch(error => this.uiService.showErrorSnackBar(error.message));
  }

  fetchUsers() {
    this.store.dispatch(new UI.StartLoadingUsers());
    this.afs
      .collection<User>('users')
      .valueChanges()
      .subscribe(
        users => {
          this.store.dispatch(new UI.StopLoadingUsers());
          this.store.dispatch(new Auth.SetUsers(users));
        },
        error => {
          this.store.dispatch(new UI.StopLoadingUsers());
          this.uiService.showErrorSnackBar(error.message);
        }
      );
  }

  fetchUser(id: string) {
    this.store.dispatch(new UI.StartLoadingUser(id));
    this.fbSubs.push(
      this.afs
        .doc<User>(`users/${id}`)
        .valueChanges()
        .subscribe(
          user => {
            this.store.dispatch(new UI.StopLoadingUser(id));
            this.store.dispatch(new Auth.SetUserById({ id, user }));
          },
          error => {
            this.store.dispatch(new UI.StopLoadingUser(id));
            this.uiService.showErrorSnackBar(error.message);
          }
        )
    );
  }

  updateProfileSettings(data: ProfileSettingsData) {
    this.store.dispatch(new UI.StartLoadingProfileSettings());

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${data.userId}`);

    if (data.photo) {
      const photoPath = `avatars/${new Date().getTime()}_${data.photo.name}`;

      const fileRef: AngularFireStorageReference = this.afStorage.ref(photoPath);

      const task = this.afStorage.upload(photoPath, data.photo);

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef
              .getDownloadURL()
              .pipe(first())
              .subscribe((photoURL: string) => {
                userRef
                  .update({
                    displayName: data.name,
                    phoneNumber: data.phone,
                    photoURL
                  })
                  .then(() => {
                    this.store.dispatch(new UI.StopLoadingProfileSettings());
                    this.uiService.showSuccessSnackBar('The changes have been saved');
                  })
                  .catch(error => {
                    this.store.dispatch(new UI.StopLoadingProfileSettings());
                    this.uiService.showErrorSnackBar(error.message);
                  });
              });
          })
        )
        .subscribe(
          () => {},
          error => {
            this.store.dispatch(new UI.StopLoadingProfileSettings());
            this.uiService.showErrorSnackBar(error.message);
          }
        );
    } else {
      userRef
        .update({
          displayName: data.name,
          phoneNumber: data.phone
        })
        .then(() => {
          this.store.dispatch(new UI.StopLoadingProfileSettings());
          this.uiService.showSuccessSnackBar('The changes have been saved');
        })
        .catch(error => {
          this.store.dispatch(new UI.StopLoadingProfileSettings());
          this.uiService.showErrorSnackBar(error.message);
        });
    }
  }

  private updateUserData(user: firebase.User) {
    // Sets user data to firestore on sign up
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber
    };

    userRef
      .set(data, { merge: true })
      .catch(error => this.uiService.showErrorSnackBar(error.message));
  }

  private socialSignIn(
    provider: auth.GoogleAuthProvider | auth.FacebookAuthProvider | auth.FacebookAuthProvider
  ) {
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        if (credential.additionalUserInfo.isNewUser) {
          this.updateUserData(credential.user);
        }
      })
      .catch(error => this.uiService.showErrorSnackBar(error.message));
    this.router.navigate(['/']);
  }
}

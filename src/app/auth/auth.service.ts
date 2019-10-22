import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { of, Subscription, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from './user.model';
import { SignInAuthData, SignUpAuthData } from './auth-data.model';
import { UIService } from '../shared/ui.service';
import { TweetService } from '../tweet/tweet.service';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';
import * as TweetActions from '../tweet/tweet.actions';
import * as fromRoot from '../app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private fbSubs: Subscription[] = [];

  public authChecked = new Subject<boolean>();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private uiService: UIService,
    private tweetService: TweetService,
    private store: Store<fromRoot.State>
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
          this.cancelSubscriptions();
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
          displayName: `${authData.firstName} ${authData.lastName}`
        });
      })
      .catch(error => this.uiService.showSnackBar(error.message));
  }

  signInWithEmailAndPassword(authData: SignInAuthData) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .catch(error => this.uiService.showSnackBar(error.message));
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
    this.afAuth.auth.signOut().catch(error => this.uiService.showSnackBar(error.message));
  }

  updateUserData(user: firebase.User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    userRef.set(data, { merge: true }).catch(error => this.uiService.showSnackBar(error.message));
  }

  fetchUsers() {
    this.store.dispatch(new UI.StartLoadingUsers());
    this.fbSubs.push(
      this.afs
        .collection<User>('users')
        .valueChanges()
        .subscribe(
          users => {
            this.store.dispatch(new UI.StopLoadingUsers());
            this.store.dispatch(new Auth.SetUsers(users));
          },
          () => {
            this.store.dispatch(new UI.StopLoadingUsers());
            this.uiService.showSnackBar('Fetching users failed, please try anain later');
          }
        )
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
          () => {
            this.store.dispatch(new UI.StopLoadingUser(id));
            this.uiService.showSnackBar('Fetching User failed, please try anain later');
          }
        )
    );
  }

  private socialSignIn(
    provider: auth.GoogleAuthProvider | auth.FacebookAuthProvider | auth.FacebookAuthProvider
  ) {
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => this.updateUserData(credential.user))
      .catch(error => this.uiService.showSnackBar(error.message));
  }

  private cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}

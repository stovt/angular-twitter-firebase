import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UIService } from '../shared/ui.service';
import { User } from './user.model';
import * as fromRoot from '../app.reducer';
import * as Auth from './auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private uiService: UIService,
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
          this.store.dispatch(new Auth.SetUnauthenticated());
        }
        this.router.navigate(['/']);
      });
  }

  facebookSignIn() {
    const provider = new auth.FacebookAuthProvider();
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => this.updateUserData(credential.user))
      .catch(error => this.uiService.showSnackBar(error.message));
  }

  googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => this.updateUserData(credential.user))
      .catch(error => this.uiService.showSnackBar(error.message));
  }

  signOut() {
    this.afAuth.auth
      .signOut()
      .then(() => this.router.navigate(['/']))
      .catch(error => this.uiService.showSnackBar(error.message));
  }

  updateUserData(user: firebase.User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName
    };

    userRef.set(data, { merge: true }).catch(error => this.uiService.showSnackBar(error.message));
  }
}

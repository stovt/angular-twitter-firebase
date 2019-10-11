import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from './user.model';
import * as fromRoot from '../app.reducer';
import * as Auth from './auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
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
          this.store.dispatch(new Auth.SetUserId(user.userId));
          this.store.dispatch(new Auth.SetAuthenticated());
        } else {
          this.store.dispatch(new Auth.SetUnauthenticated());
        }
        this.router.navigate(['/']);
      });
  }

  async facebookSignIn() {
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    console.log('TCL: AuthService -> facebookSignIn -> credential', credential);
    return this.updateUserData(credential.user);
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  updateUserData(user: firebase.User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName
    };

    return userRef.set(data, { merge: true });
  }
}

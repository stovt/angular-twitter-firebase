import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { User } from '../../../auth/user.model';
import { AuthService } from '../../../auth/auth.service';
import * as fromRoot from '../../../app.reducer';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})
export class ProfileImageComponent implements OnInit, OnDestroy {
  user: User;

  userSub: Subscription;

  constructor(private store: Store<fromRoot.State>, private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.store.select(fromRoot.getUser).subscribe(user => (this.user = user));
  }

  onLogout() {
    this.authService.signOut();
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { User } from '../../auth/user.model';
import * as fromRoot from '../../app.reducer';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  users$: Observable<User[]>;
  fetchUsersSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsUsersLoading);
    this.users$ = this.store.select(fromRoot.getUsers);
    this.fetchUsersSubscription = this.authService.fetchUsers();
  }

  ngOnDestroy() {
    this.fetchUsersSubscription.unsubscribe();
  }
}

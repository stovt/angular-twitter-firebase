import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../auth/user.model';
import * as fromRoot from '../../app.reducer';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  isLoading$: Observable<boolean>;
  users: User[];

  constructor(private store: Store<fromRoot.State>, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsUsersLoading);
    this.store.select(fromRoot.getUsers).subscribe(users => {
      this.users = users;
      if (!users.length) {
        this.authService.fetchUsers();
      }
    });
  }
}

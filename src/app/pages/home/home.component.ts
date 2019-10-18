import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../auth/user.model';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user$: Observable<User>;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.user$ = this.store.select(fromRoot.getUser);
  }
}

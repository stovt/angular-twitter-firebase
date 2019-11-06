import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { User } from '../../auth/user.model';
import * as fromRoot from '../../app.reducer';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  profileSettingsForm: FormGroup;
  isLoading = false;

  user: User;
  userSub: Subscription;

  constructor(private store: Store<fromRoot.State>, private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.store.select(fromRoot.getUser).subscribe(user => (this.user = user));

    this.profileSettingsForm = new FormGroup({
      name: new FormControl(this.user && this.user.displayName, [Validators.required]),
      email: new FormControl(
        {
          value: this.user && this.user.email,
          disabled: true
        },
        [Validators.required, Validators.email]
      ),
      phone: new FormControl(this.user && this.user.phoneNumber, [
        Validators.pattern('[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}')
      ])
    });
  }

  onSubmit({ name, phone }: { name: string; phone: string }) {
    this.isLoading = true;
    this.authService
      .updateProfileSettings({
        userId: this.user.userId,
        name,
        phone
      })
      .then(() => (this.isLoading = false))
      .catch(() => (this.isLoading = false));
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}

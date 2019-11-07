import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { User } from '../../auth/user.model';
import { AuthService } from '../../auth/auth.service';
import { UIService } from '../../shared/ui.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  profileSettingsForm: FormGroup;
  isLoading$: Observable<boolean>;

  user: User;
  userSub: Subscription;
  photo: File;
  photoURL: string;

  isProfileDeleting = false;

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private uiService: UIService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userSub = this.store.select(fromRoot.getUser).subscribe(user => {
      this.user = user;
      this.photoURL = user ? user.photoURL : null;
    });

    this.isLoading$ = this.store.select(fromRoot.getIsProfileSettingsLoading);

    this.profileSettingsForm = new FormGroup({
      photo: new FormControl(),
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

  onFileSelected(event: FileList) {
    const file = event.item(0);

    if (!file) {
      return;
    }

    if (file.type.split('/')[0] !== 'image') {
      this.uiService.showWarningSnackBar('Unsupported file type');
      return;
    }

    if (file.size / (1024 * 1024) > 2) {
      this.uiService.showWarningSnackBar('Max file size is 2MB');
      return;
    }

    this.photo = file;

    // update image preview
    const inputNode: any = document.querySelector('#file-photo');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.photoURL = e.target.result);
      reader.readAsDataURL(inputNode.files[0]);
    }
  }

  onSubmit({ name, phone }: { name: string; phone: string }) {
    this.authService.updateProfileSettings({
      userId: this.user.userId,
      name,
      phone,
      photo: this.photo
    });
  }

  onDeleteProfile() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.isProfileDeleting = true;
        this.authService
          .deleteUser()
          .then(() => (this.isProfileDeleting = false))
          .catch(() => (this.isProfileDeleting = false));
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}

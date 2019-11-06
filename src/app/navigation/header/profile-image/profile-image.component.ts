import { Component } from '@angular/core';

import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})
export class ProfileImageComponent {
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.signOut();
  }
}

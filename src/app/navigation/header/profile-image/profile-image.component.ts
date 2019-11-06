import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})
export class ProfileImageComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onLogout() {
    this.authService.signOut();
  }
}

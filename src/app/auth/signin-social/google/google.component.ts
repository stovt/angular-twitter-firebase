import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signin-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css']
})
export class GoogleComponent implements OnInit {
  constructor(
    private authService: AuthService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/google.svg')
    );
  }

  ngOnInit() {}

  onSignInGoogle() {
    this.authService.googleSignIn();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.signUpForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, this.equalsTo('password')]),
      agree: new FormControl('', [Validators.requiredTrue])
    });
  }

  onSubmit(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const { firstName, lastName, email, password } = data;

    this.authService.signUp({
      firstName,
      lastName,
      email,
      password
    });
  }

  private equalsTo(compareTo: string): ValidatorFn {
    return (control: FormControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      const compareToControl = control.parent.get(compareTo);
      return compareToControl.value !== control.value
        ? {
            notEquals: true
          }
        : null;
    };
  }
}

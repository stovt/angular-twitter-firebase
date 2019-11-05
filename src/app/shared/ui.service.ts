import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackbarComponent, SnackType } from './snackbar/snackbar.component';

@Injectable({ providedIn: 'root' })
export class UIService {
  duration = 4000;

  constructor(private snackbar: MatSnackBar) {}

  showSuccessSnackBar(message: string, duration: number = this.duration) {
    this.showSnackBar(message, 'success', duration);
  }

  showWarningSnackBar(message: string, duration: number = this.duration) {
    this.showSnackBar(message, 'warning', duration);
  }

  showErrorSnackBar(message: string, duration: number = this.duration) {
    this.showSnackBar(message, 'error', duration);
  }

  showInfoSnackBar(message: string, duration: number = this.duration) {
    this.showSnackBar(message, 'info', duration);
  }

  private showSnackBar(
    message: string,
    snackType: SnackType = 'success',
    duration: number = 160000
  ) {
    this.snackbar.openFromComponent(SnackbarComponent, {
      duration,
      panelClass: `snackbar-${snackType}`,
      data: { message, snackType, actions: 'sds' }
    });
  }
}

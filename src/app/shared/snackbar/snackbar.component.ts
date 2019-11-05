import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

export type SnackType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {
      message: string;
      snackType: SnackType;
    }
  ) {}

  get getIcon() {
    switch (this.data.snackType) {
      case 'success':
        return 'done';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
    }
  }
}

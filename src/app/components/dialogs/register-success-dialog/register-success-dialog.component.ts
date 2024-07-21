import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { InfoUserResponse } from '../../../models/InfoUserResponse';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-success-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './register-success-dialog.component.html',
  styleUrl: './register-success-dialog.component.scss',
})
export class RegisterSuccessDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      user: InfoUserResponse;
    },
    public dialogRef: MatDialogRef<RegisterSuccessDialogComponent>,
    private readonly route: Router
  ) {}

  goToLogin() {
    this.dialogRef.close();
    this.route.navigate(['/login']);
  }
}

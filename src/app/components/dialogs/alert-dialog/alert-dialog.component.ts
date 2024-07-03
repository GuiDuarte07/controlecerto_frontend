import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss',
})
export class AlertDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      successMessage?: string;
      actionButtonMessage?: string;
    },
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  openSnackBar() {
    if (this.data.successMessage) {
      this.snackBar.open(this.data.successMessage, undefined, {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['.snackbar-error'],
      });
    }
  }

  closeDialog(sucess: boolean) {
    if (sucess) {
      this.openSnackBar();
    }
    this.dialogRef.close(sucess);
  }
}

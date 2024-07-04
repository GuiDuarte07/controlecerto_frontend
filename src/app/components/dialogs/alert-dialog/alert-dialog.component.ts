import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

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
      confirmObservable?: Observable<any>;
    },
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['.snackbar-error'],
    });
  }

  closeDialog(sucess: boolean) {
    if (sucess) {
      this.data.confirmObservable?.subscribe({
        next: () => {
          this.openSnackBar(this.data.successMessage!);
          this.dialogRef.close(sucess);
        },
        error: (err: HttpErrorResponse) => {
          this.openSnackBar(`Erro: ${err.message}`);
        },
      });
    } else {
      this.dialogRef.close(sucess);
    }
  }
}

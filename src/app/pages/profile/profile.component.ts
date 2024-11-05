import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfoUserResponse } from '../../models/InfoUserResponse';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetailsUserResponse } from '../../models/DetailsUserResponse';
import { CommonModule } from '@angular/common';
import { UpdateUserRequest } from '../../models/UpdateUserRequest';

interface IChangePasswordForm {
  oldPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  loading = false;

  editEmail = false;
  newEmailString = '';

  editName = false;
  newNameString = '';

  changePasswordLoading = false;
  passwordVisibility = false;
  changePasswordError = '';
  changePasswordForm!: FormGroup<IChangePasswordForm>;

  closeConfirmEmailAlert: boolean = false;

  user!: DetailsUserResponse | null;

  constructor(
    private readonly userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      confirmPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      newPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
    });

    this.loading = true;
    this.userService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.loading = false;
          this.user = user;
          this.newEmailString = user.email;
          this.newNameString = user.name;
          this.loading = false;
        }
      },
    });
  }

  sendConfirmEmail() {
    this.userService
      .sendConfirmEmail()
      .subscribe((_) => this.sendCloseConfirmEmailAlert());
  }

  sendCloseConfirmEmailAlert() {
    this.closeConfirmEmailAlert = true;
  }

  updatePassword() {
    if (!this.changePasswordForm.valid) {
      return;
    }

    this.changePasswordError = '';
    this.changePasswordLoading = true;

    this.userService
      .changePassword(
        this.changePasswordForm.value.oldPassword!,
        this.changePasswordForm.value.newPassword!
      )
      .subscribe({
        next: () => {
          this.changePasswordLoading = false;
          this.openSnackBar('Senha atualizada com sucesso!');
          this.changePasswordForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.changePasswordLoading = false;
          this.changePasswordError = err.error;
        },
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['.snackbar-error'],
    });
  }

  setEditEmail() {
    if (this.editEmail === false) {
      this.editEmail = !this.editEmail;
      this.newEmailString = '';
    } else {
      if (this.newEmailString !== this.user!.email) {
        this.editEmail = !this.editEmail;

        const request = new UpdateUserRequest(
          this.user!.id,
          undefined,
          this.newEmailString
        );

        this.userService.updateUser(request).subscribe({
          next: (response) => {
            this.user = response;
          },
        });
      }
    }
  }

  setEditName() {
    if (this.editName === false) {
      this.editName = !this.editName;
      this.newNameString = '';
    } else {
      if (this.newNameString !== this.user!.name) {
        this.editName = !this.editName;

        const request = new UpdateUserRequest(
          this.user!.id,
          this.newNameString
        );

        this.userService.updateUser(request).subscribe({
          next: (response) => {
            this.user = response;
          },
        });
      }
    }
  }

  setPasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }
}

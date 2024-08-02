import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Createuser } from '../../models/CreateUser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterSuccessDialogComponent } from '../../components/dialogs/register-success-dialog/register-success-dialog.component';
import { InfoUserResponse } from '../../models/InfoUserResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface IRegisterForm {
  email: FormControl<string>;
  password: FormControl<string>;
  name: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup<IRegisterForm>;
  loading = false;
  fromServerError?: string;

  passwordVisibility = false;

  constructor(
    private readonly userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z\s]+$/),
        ],
      }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.email,
        ],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
    });
  }

  register() {
    this.loading = true;
    this.fromServerError = '';

    this.registerForm.patchValue({
      name: this.capitalizeFirstLetter(this.registerForm.value.name!),
    });

    const user = new Createuser(this.registerForm.getRawValue());

    this.userService.createUser(user).subscribe({
      next: (user) => {
        this.registerForm.reset();
        this.openSuccessDialog(user);
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.fromServerError = err.error;
        this.loading = false;
      },
    });
  }

  openSuccessDialog(user: InfoUserResponse) {
    this.dialog.open(RegisterSuccessDialogComponent, {
      data: {
        user,
      },
    });
  }

  setPasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }

  capitalizeFirstLetter(str: string) {
    const words: string[] = str.toLowerCase().trim().split(' ');

    const capitalizedWords = words.map((word) =>
      (word.charAt(0).toUpperCase() + word.slice(1)).trim()
    );

    const capitalizedStr = capitalizedWords.join(' ');

    return capitalizedStr;
  }
}

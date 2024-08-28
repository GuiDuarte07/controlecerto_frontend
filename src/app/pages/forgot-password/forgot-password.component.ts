import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordsMatchValidator } from '../../validators/passwordsMatchValidator'

interface IForgotPasswordForm {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, MatProgressSpinnerModule, CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup<IForgotPasswordForm>;
  token!: string;

  pageLoading = false;
  invalidToken: boolean = false;

  sendForgotPasswordLoading = false;
  fromServerError: string | null = null;
  successToUpdatePassword = false;


  passwordVisibility = false;

  constructor(
    private readonly userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token') ?? '';

    this.forgotPasswordForm = new FormGroup({
      password: new FormControl<string>('', {
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
    }, {
      validators:
        passwordsMatchValidator()
    });

    this.userService.verifyForgotPasswordToken(this.token).subscribe({
      next: () => {
        this.pageLoading = false;
        this.invalidToken = false;
        this.fromServerError = null;
      },
      error: (error: HttpErrorResponse) => {
        this.pageLoading = false;
        this.invalidToken = true;
        this.fromServerError = error.error;
      }
    });
  }

  sendForgotPassword() {
    if(!this.forgotPasswordForm.valid) return;

    const password = this.forgotPasswordForm.value.password!;
    const confirmPassword = this.forgotPasswordForm.value.confirmPassword!;

    this.sendForgotPasswordLoading = true;

    this.userService.sendForgotPassword(this.token, password, confirmPassword).subscribe({
      next: () => {
        this.sendForgotPasswordLoading = false;
        this.successToUpdatePassword = true;
        this.fromServerError = null;
      },
      error: (error: HttpErrorResponse) => {
        this.successToUpdatePassword = false;
        this.sendForgotPasswordLoading = false;
        this.fromServerError = error.error;
      }
    });
  }

  setPasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }
}

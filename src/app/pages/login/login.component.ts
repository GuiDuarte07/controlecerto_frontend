import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface ILoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup<ILoginForm>;
  passwordVisibility = false;
  loading = false;
  fromServerError?: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
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

  login() {
    this.loading = true;
    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;
    this.authService.authenticate(email, password).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl('/home');
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Authentication failed', error);
        this.fromServerError = error.error;
        this.loading = false;
      },
    });
  }

  setPasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }
}

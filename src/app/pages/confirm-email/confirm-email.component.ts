import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [RouterModule, MatProgressSpinnerModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent implements OnInit {
  confirmedEmail = false;
  loading = true;
  serverErrorMessage: string | null = null;
  sendEmailButtonSuccess = false;
  loadingSendEmailButton = false;

  constructor(
    private readonly userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.paramMap.get('token') ?? '';

    this.userService.confirmEmail(token).subscribe({
      next: () => {
        this.confirmedEmail = true;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.serverErrorMessage = error.error;
        this.loading = false;
      },
    });
  }

  resendConfirmEmail() {
    this.userService.sendConfirmEmail().subscribe({
      next: () => {
        this.sendEmailButtonSuccess = true;
        this.loadingSendEmailButton = false;
      },
      error: (error: HttpErrorResponse) => {
        this.sendEmailButtonSuccess = false;
        this.loadingSendEmailButton = false;
        this.serverErrorMessage = error.error;
      },
    });
    //
  }
}

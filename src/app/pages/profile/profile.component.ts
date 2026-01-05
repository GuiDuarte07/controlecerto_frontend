import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetailsUserResponse } from '../../models/DetailsUserResponse';
import { CommonModule } from '@angular/common';
import { UpdateUserRequest } from '../../models/UpdateUserRequest';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordModule } from 'primeng/password';
import { ResetUserDialogComponent } from '../../components/dialogs/reset-user-dialog/reset-user-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { passwordsMatchValidator } from '../../validators/passwordsMatchValidator';

interface IChangePasswordForm {
  oldPassword: FormControl<string>;
  password: FormControl<string>;
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
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    PasswordModule,
    ResetUserDialogComponent,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
  ],
  providers: [ConfirmationService, MessageService],
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

  @ViewChild(ResetUserDialogComponent)
  resetDialog!: ResetUserDialogComponent;

  constructor(
    private readonly userService: UserService,
    private snackBar: MatSnackBar,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.changePasswordForm = new FormGroup(
      {
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
        password: new FormControl<string>('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        }),
      },
      { validators: passwordsMatchValidator() }
    );

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

  jsonparse(s: any) {
    return JSON.parse(s);
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
        this.changePasswordForm.value.password!
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

  openResetDialog() {
    if (this.resetDialog) {
      this.resetDialog.openDialog();
    }
  }

  confirmDeleteUser(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Deletar Usuário',
      message:
        'Deseja deletar seu usuário permanentemente? Essa ação não pode ser revertida.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Deletar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.userService.deleteUser().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Conta Deletada',
              detail: 'Sua conta foi deletada com sucesso. Fazendo logout...',
              life: 3000,
            });

            setTimeout(() => {
              this.authService.logout().subscribe();
            }, 1000);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro ao Deletar Conta',
              detail: err.error || 'Ocorreu um erro ao deletar sua conta',
              life: 4000,
            });
          },
        });
      },
    });
  }
}

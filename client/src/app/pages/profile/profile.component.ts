import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfoUserResponse } from '../../models/InfoUserResponse';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatProgressSpinnerModule, FormsModule, MatExpansionModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  loading = false;
  editEmail = false;
  newEmailString = 'guilduarte.abr@gmail.com';
  passwordVisibility = false;

  user: InfoUserResponse = new InfoUserResponse(
    21,
    'José Guilherme Duarte Abrantes',
    'guilduarte.abr@gmail.com',
    true
  );

  ngOnInit(): void {
    this.newEmailString = this.user.email;
  }

  setEditEmail() {
    if (this.editEmail === false) {
      this.editEmail = !this.editEmail;
      this.newEmailString = '';
    } else {
      //Enviar requisição para backend
      if (this.newEmailString == this.user.email) {
        this.editEmail = !this.editEmail;
      }
    }
  }

  setPasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }
}

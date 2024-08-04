import { Injectable } from '@angular/core';
import { serverConnectionString } from '../config/server';
import { HttpClient } from '@angular/common/http';
import { Createuser } from '../models/CreateUser';
import { InfoUserResponse } from '../models/InfoUserResponse';
import { DetailsUserResponse } from '../models/DetailsUserResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private hostAddress = `${serverConnectionString}/User`;

  constructor(private httpClient: HttpClient) {}

  getUser() {
    const rote = 'GetUser';
    return this.httpClient.get<DetailsUserResponse>(
      `${this.hostAddress}/${rote}`
    );
  }

  createUser(user: Createuser) {
    const rote = 'CreateUser';
    return this.httpClient.post<InfoUserResponse>(
      `${this.hostAddress}/${rote}`,
      user
    );
  }

  confirmEmail(token: string) {
    const rote = 'ConfirmEmail';
    return this.httpClient.get(`${this.hostAddress}/${rote}/${token}`);
  }

  sendConfirmEmail() {
    const rote = 'SendConfirmEmail';
    return this.httpClient.get(`${this.hostAddress}/${rote}`);
  }

  changePassword(oldPassword: string, newPassword: string) {
    const rote = 'ChangePassword';
    return this.httpClient.post<void>(`${this.hostAddress}/${rote}`, {
      oldPassword: oldPassword,
      newPassword: newPassword
    });
  }
}

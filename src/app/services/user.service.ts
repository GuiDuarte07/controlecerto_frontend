import { UpdateUserRequest } from './../models/UpdateUserRequest';
import { Injectable } from '@angular/core';
import { serverConnectionString } from '../config/server';
import { HttpClient } from '@angular/common/http';
import { Createuser } from '../models/CreateUser';
import { InfoUserResponse } from '../models/InfoUserResponse';
import { DetailsUserResponse } from '../models/DetailsUserResponse';
import { ResetUserDataRequest } from '../models/ResetUserDataRequest';
import { ResetUserDataResponse } from '../models/ResetUserDataResponse';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private hostAddress = `${serverConnectionString}/User`;

  constructor(private httpClient: HttpClient) {}

  getUser(): Observable<DetailsUserResponse> {
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
      newPassword: newPassword,
    });
  }

  sendForgotPasswordEmail(email: string) {
    const rote = 'SendForgotPasswordEmail';
    return this.httpClient.post<boolean>(`${this.hostAddress}/${rote}`, {
      email,
    });
  }

  verifyForgotPasswordToken(token: string) {
    const rote = 'VerifyForgotPasswordToken';
    return this.httpClient.get<boolean>(`${this.hostAddress}/${rote}/${token}`);
  }

  sendForgotPassword(token: string, password: string, confirmPassword: string) {
    const rote = 'ForgotPassword';
    return this.httpClient.post<void>(`${this.hostAddress}/${rote}/${token}`, {
      password,
      confirmPassword,
    });
  }

  updateUser(
    updateUserRequest: UpdateUserRequest
  ): Observable<DetailsUserResponse> {
    const rote = 'Update';
    return this.httpClient.patch<DetailsUserResponse>(
      `${this.hostAddress}/${rote}`,
      updateUserRequest
    );
  }

  resetUserData(request: ResetUserDataRequest) {
    const rote = 'ResetUserData';
    return this.httpClient.post<ResetUserDataResponse>(
      `${this.hostAddress}/${rote}`,
      request
    );
  }

  deleteUser() {
    const rote = 'DeleteUser';
    return this.httpClient.delete(`${this.hostAddress}/${rote}`);
  }
}

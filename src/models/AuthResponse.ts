// auth-response.ts

import { InfoUserResponse } from './InfoUserResponse';

export class AuthResponse {
  user: InfoUserResponse;
  token: string;

  constructor(user: InfoUserResponse, token: string) {
    this.user = user;
    this.token = token;
  }
}

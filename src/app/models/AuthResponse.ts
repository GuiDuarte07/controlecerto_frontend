// auth-response.ts

import { InfoUserResponse } from './InfoUserResponse';

export class AuthResponse {
  user: InfoUserResponse;
  accessToken: string;
  refreshToken: string;

  constructor(
    user: InfoUserResponse,
    accessToken: string,
    refreshToken: string
  ) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

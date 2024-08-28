import { CSP_NONCE, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthResponse } from '../models/AuthResponse';
import { Router } from '@angular/router';
import { serverConnectionString } from '../config/server';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hostAddress = `${serverConnectionString}/Auth`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  public authenticate(
    email: string,
    password: string
  ): Observable<AuthResponse> {
    const suffix = 'Authenticate';
    const body = { email, password };
    return this.http
      .post<AuthResponse>(`${this.hostAddress}/${suffix}`, body)
      .pipe(
        tap((response) => {
          this.cookieService.set('AccessToken', response.accessToken);
          this.cookieService.set('RefreshToken', response.refreshToken);
        })
      );
  }

  getNewAccessToken(): Observable<{ accessToken: string }> {
    const route = 'GenerateAccessToken';
    const refreshToken = this.cookieService.get('RefreshToken');
    if (!refreshToken) {
      this.logout();
    }

    return this.http.get<{ accessToken: string }>(
      `${this.hostAddress}/${route}/${refreshToken}`
    );
  }

  public logout(): Observable<boolean> {
    const route = 'Logout';
    const refreshToken = localStorage.getItem('RefreshToken');

    this.cookieService.delete('AccessToken');
    this.cookieService.delete('RefreshToken');
    this.router.navigate(['/login']);

    if (!refreshToken) {
      return of(true);
    }

    return this.http.get<boolean>(
      `${this.hostAddress}/${route}/${refreshToken}`
    );
  }
}

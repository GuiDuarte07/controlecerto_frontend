import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthResponse } from '../models/AuthResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hostAddress = 'http://localhost:5037/api/Auth';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

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
          this.cookieService.set('BearerToken', response.token);
        })
      );
  }
}

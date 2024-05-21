import { Injectable } from '@angular/core';
import { InfoUserResponse } from '../../models/InfoUserResponse';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../../models/AuthResponse';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hostAddress = 'http://localhost:5037/api';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  public authenticate(
    email: string,
    password: string
  ): Observable<AuthResponse> {
    const suffix = 'Auth/Authenticate';
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

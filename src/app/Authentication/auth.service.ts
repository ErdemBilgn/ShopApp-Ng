import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from './auth-response.model';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api_key = environment.apiKey;

  user = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient) {}

  register(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.api_key}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((res) => {
          this.handleUser(res.email, res.localId, res.idToken, res.expiresIn);
        }),
        catchError(this.handleError)
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.api_key}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((res) => {
          this.handleUser(res.email, res.localId, res.idToken, res.expiresIn);
        }),
        catchError(this.handleError)
      );
  }

  autoLogin() {
    if (localStorage.getItem('user') == null) {
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user);
    const loadedUser = new User(
      user.email,
      user.localId,
      user._token,
      new Date(user._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('user');
  }

  private handleError(err: HttpErrorResponse) {
    let message = 'Hata oluştu';

    if (err.error.error.message) {
      switch (err.error.error.message) {
        case 'EMAIL_EXISTS':
          message = 'Bu Eposta zaten kullanılıyor!';
          break;

        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          message = 'Bir süre bekleyip tekrar deneyiniz!';
          break;

        case 'INVALID_LOGIN_CREDENTIALS':
          message = 'Email ya da Parola yanlış !';
          break;
      }
    }

    return throwError(() => message);
  }

  private handleUser(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: string
  ) {
    const expiresInMs = +expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresInMs);
    const user = new User(email, localId, idToken, expirationDate);

    console.log(user);

    this.user.next(user);

    localStorage.setItem('user', JSON.stringify(user));
  }
}

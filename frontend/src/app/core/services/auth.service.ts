
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthData } from '../models/auth/auth-data.model';
import { GlobalResponse } from '../../shared/models/global-response.dto';
import { LoginResponse } from '../models/auth/login-response.model';

const BACKEND_URL = environment.apiUrl + '/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isAuthenticated = false;
  private readonly authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  private userId: string | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresIn: number | null = null;

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  getAccessToken() {
    return this.accessToken;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  getExpiresIn() {
    return this.expiresIn;
  }

  getAuthStatusListener() {
     return this.authStatusListener.asObservable();
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};

    return this.http
      .post<GlobalResponse>(BACKEND_URL + '/login', authData)
      .pipe(
        tap(response => {
          const loginResponse = response.data as LoginResponse;

          this.accessToken = loginResponse.access_token;
          if (this.accessToken) {
            this.refreshToken = loginResponse.refresh_token;
            this.expiresIn = loginResponse.expires_in;

            const expiresInDuration = this.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;

            this.userId = loginResponse.user_id;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(this.accessToken, this.refreshToken, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        }),
        catchError(error => {
          this.authStatusListener.next(false);
          return throwError(() => error);
        })
      );
  }

  logout() {
    this.isAuthenticated = false;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    if (authInformation !== null) {
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

      //if the result not minus
      if (expiresIn > 0) {
        this.accessToken = authInformation.accessToken;
        this.refreshToken = authInformation.refreshToken;
        this.isAuthenticated = true;
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
    //* 1000 from miliseconds to seconds
  }

  private saveAuthData(accessToken: string, refreshToken: string, expirationDate: Date, userId: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private getAuthData() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!accessToken || !expirationDate) {
      return null;
    }

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

}

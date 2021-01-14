import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthToken, Credentials } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token: string = '';

  constructor(private http: HttpClient) {}

  async login(cred: Credentials): Promise<void> {
    console.log('credentials:', cred);
    try {
      const res = await this.http
        .post<AuthToken>('/auth/login', cred)
        .toPromise();

      console.log('login successful: ', res.message);
      console.log('token from authsrv:', res.token);
      this._token = res.token;
    } catch (error) {
      if (error.status == 401) {
        console.log('Unauthorized error: ', error);
      }
      console.info('error: ', error);
    }
  }

  async socialLogin(email: string): Promise<void> {
    console.log('email: ', email);
    try {
      const res = await this.http
        .post<AuthToken>('/auth/login/social', { email })
        .toPromise();

      console.log('social login successful: ', res.message);

      this._token = res.token;
    } catch (error) {
      if (error.status == 401) {
        // handle error
        console.log('Unauthorized error: ', error);
        return;
      }
      console.info('error: ', error);
    }
  }

  isLogin() {
    return this._token != '';
  }

  get token(): string {
    return this._token;
  }
}

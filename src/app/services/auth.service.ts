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

  login(cred: Credentials): Subscription {
    console.log('credentials:', cred);
    return this.http.post<AuthToken>('/auth/login', cred).subscribe(
      (res) => {
        console.log('login successful: ', res.message);

        this._token = res.token;
      },
      (error) => {
        if (error.status == 401) {
          // handle error
          console.log('Unauthorized error: ', error);
          return;
        }
        console.info('error: ', error);
      }
    );
  }

  socialLogin(email: string) {
    console.log('email: ', email);
    return this.http
      .post<AuthToken>('/auth/login/social', { email })
      .subscribe(
        (res) => {
          console.log('social login successful: ', res.message);

          this._token = res.token;
        },
        (error) => {
          if (error.status == 401) {
            // handle error
            console.log('Unauthorized error: ', error);
            return;
          }
          console.info('error: ', error);
        }
      );
  }

  isLogin() {
    return this._token != '';
  }

  get token(): string {
    return this._token;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthToken, Credentials } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  async login(cred: Credentials): Promise<void> {
    try {
      const res = await this.http
        .post<AuthToken>('/auth/login', cred)
        .toPromise();

      this._token = res.token;
    } catch (error) {
      if (error.status == 401) {
        console.log('Unauthorized error: ', error);
      }
      console.info('error: ', error);
    }
  }

  async socialLogin(email: string): Promise<void> {
    try {
      const res = await this.http
        .post<AuthToken>('/auth/login/social', { email })
        .toPromise();

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

  logout() {
    this._token = '';
    this.router.navigate(['/']);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLogin()) return true;
    return this.router.parseUrl('/error');
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthToken, Credentials } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(cred: Credentials) {
    console.log('credentials:', cred);
    return this.http.post<AuthToken>('/auth/login', cred);
  }
}

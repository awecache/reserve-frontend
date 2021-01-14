import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SocialAuthService, SocialUser } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  username?: string;
  password?: string;
  user?: SocialUser;
  hide = true;
  loginSub$?: Subscription;
  socialLoginSub$?: Subscription;

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private socialAuthService: SocialAuthService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.loginSub$?.unsubscribe();
    this.socialLoginSub$?.unsubscribe();
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  async signInWithGoogle(): Promise<any> {
    const user = await this.socialAuthService.signIn(
      GoogleLoginProvider.PROVIDER_ID
    );

    this.socialLoginSub$ = this.authService.socialLogin(user.email);

    this.form.reset();
  }

  // signInWithFB(): void {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }

  refreshToken(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  login() {
    this.loginSub$ = this.authService.login(this.form.value);
    this.form.reset();
  }
}

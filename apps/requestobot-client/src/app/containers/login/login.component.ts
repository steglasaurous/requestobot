import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { WindowWithElectron } from '../../models/window.global';
import { QUEUEBOT_API_BASE_URL } from '../../app.config';
import { ButtonPrimaryComponent } from '../../components/button-primary/button-primary.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../state/auth.actions';
import { selectAuth } from '../../state/auth.selectors';
import {
  AuthState,
  initialState,
  LoginProcessState,
} from '../../state/auth.reducer';
import { NgIf } from '@angular/common';

declare let window: WindowWithElectron;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonPrimaryComponent,
    InputTextComponent,
    ReactiveFormsModule,
    NgIf,
  ],
  providers: [],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  formGroup = new FormGroup({
    authCode: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  auth$ = this.store.select(selectAuth);
  auth: AuthState = initialState;

  constructor(
    @Inject(QUEUEBOT_API_BASE_URL) private apiBaseUrl: string,
    private store: Store
  ) {}
  ngOnInit() {
    // If we're authenticated, go right to the good stuff.
    if (window.login) {
      window.login.onProtocolHandle((url: string) => {
        const parsedUrl = new URL(url);
        const authCode = parsedUrl.searchParams.get('authCode');
        if (authCode) {
          this.submitAuthCode(authCode);
        } else {
          console.log('Unable to get auth code from URL');
        }
      });
    }

    this.auth$.subscribe((auth) => {
      this.auth = auth;
    });
  }

  submitAuthCode(value: string) {
    this.store.dispatch(AuthActions.submitAuthCode({ authCode: value }));
  }

  submitAuthCodeForm() {
    if (this.formGroup.value.authCode != undefined) {
      this.submitAuthCode(this.formGroup.value.authCode);
    }
  }

  openLoginPage() {
    if (window['settings']) {
      window['settings'].openTwitchLogin();
    } else {
      console.log('DEV: Open twitch auth in a new tab');
      window.open(`${this.apiBaseUrl}/auth/twitch?mode=authcode`, '_blank');
    }
  }

  protected readonly LoginProcessState = LoginProcessState;
}

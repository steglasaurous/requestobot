import { Component, Inject, isDevMode, OnDestroy, OnInit } from '@angular/core';
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
import { AuthActions } from '../../state/auth/auth.actions';
import { selectAuth } from '../../state/auth/auth.selectors';
import {
  AuthState,
  initialState,
  LoginProcessState,
} from '../../state/auth/auth.reducer';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import log from 'electron-log/renderer';
import { Subscription } from 'rxjs';

declare let window: WindowWithElectron;

@Component({
  selector: 'app-login',
  imports: [
    ButtonPrimaryComponent,
    InputTextComponent,
    ReactiveFormsModule,
    NgIf,
  ],
  providers: [],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  formGroup = new FormGroup({
    authCode: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  auth$ = this.store.select(selectAuth);
  auth: AuthState = initialState;
  private subscriptions: Subscription[] = [];
  constructor(
    @Inject(QUEUEBOT_API_BASE_URL) private apiBaseUrl: string,
    private store: Store,
    private toastr: ToastrService
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
          log.error('Unable to get auth code from URL');
        }
      });
    }

    this.subscriptions.push(
      this.auth$.subscribe((auth) => {
        this.auth = auth;
        if (auth.loginProcessState === LoginProcessState.Fail) {
          this.toastr.error('Please try again.', 'Login Failed');
        }
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
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
      window.open(`${this.apiBaseUrl}/auth/twitch?mode=authcode`, '_blank');
    }
  }

  protected readonly LoginProcessState = LoginProcessState;
  protected readonly isDevMode = isDevMode;
}

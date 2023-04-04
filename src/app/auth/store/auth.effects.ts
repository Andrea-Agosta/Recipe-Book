import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {catchError, map, of, switchMap, tap} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

import * as AuthAction from "./auth.actions";
import {environment} from "../../../environments/environment";
import { User } from "../user.model";
import {AuthService} from "../auth.service";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthAction.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true
  })
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An Unknown error occurred';
  if(!errorRes.error || !errorRes.error.error) {
    return of(new AuthAction.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exists';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct';
      break;
  }
  return of(new AuthAction.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() => this.actions$.pipe(ofType(AuthAction.SIGNUP_START),
    switchMap((signupAction: AuthAction.SignupStart) => {
      return this.http.post<AuthResponseData> (
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ environment.firebaseAPIKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
        map(resData => handleAuthentication(+resData.expiresIn,resData.email, resData.localId, resData.idToken)),
        catchError(errorRes => handleError(errorRes))
      )
    })
  ));

  authLogin = createEffect(() => this.actions$.pipe(
    ofType(AuthAction.LOGIN_START),
    switchMap((authData:AuthAction.LoginStart) => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
          map(resData => handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
          catchError(errorRes => handleError(errorRes))
        )
      }),
    )
  );

  authRedirect = createEffect(() => this.actions$.pipe(ofType(AuthAction.AUTHENTICATE_SUCCESS),
    tap((authSuccessActions: AuthAction.AuthenticateSuccess) => {
      if(authSuccessActions.payload.redirect) {
        this.router.navigate(['/']);
      }
    }),
  ),{dispatch: false});

  authLogout = createEffect(() => this.actions$.pipe(ofType(AuthAction.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    }),
  ),{dispatch: false});

  autoLogin = createEffect(() => this.actions$.pipe(ofType(AuthAction.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpiredDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if(!userData) {
        return {type: 'DUMMY'};
      }
      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpiredDate));
      if(loadedUser.token) {
        const expirationDuration = new Date(userData._tokenExpiredDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration)
        return new AuthAction.AuthenticateSuccess({
          email:loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpiredDate),
          redirect: false
        })
        // const expirationDuration = new Date(userData._tokenExpiredDate).getTime() - new Date().getTime();
        // this.autoLogout(expirationDuration);
      }
      return {type: 'DUMMY'};
    })))

  constructor(private actions$: Actions, private http: HttpClient, private router:Router, private authService: AuthService) {}
}

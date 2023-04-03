import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {catchError, map, of, switchMap, tap} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

import * as AuthAction from "./auth.actions";
import {environment} from "../../../enviroments/environment";

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
  return new AuthAction.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate
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
          map(resData => handleAuthentication(+resData.expiresIn,resData.email, resData.localId, resData.idToken)),
          catchError(errorRes => handleError(errorRes))
        )
      }),
    )
  );

  authSuccess = createEffect(() => this.actions$.pipe(ofType(AuthAction.AUTHENTICATE_SUCCESS),
    tap(() => this.router.navigate(['/'])),
  ),{dispatch: false});

  constructor(private actions$: Actions, private http: HttpClient, private router:Router) {}
}

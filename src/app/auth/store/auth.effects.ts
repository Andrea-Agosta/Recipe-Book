import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {catchError, map, mergeMap, of, switchMap, tap, throwError} from "rxjs";
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

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() => this.actions$.pipe(ofType(AuthAction.SIGNUP_START)));

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
          map(resData => {
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
            return new AuthAction.AuthenticateSuccess({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate: expirationDate
            })
          }),
          catchError(errorRes => {
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
          })
        )
      }),
    )
  );

  authSuccess = createEffect(() => this.actions$.pipe(ofType(AuthAction.AUTHENTICATE_SUCCESS),
    tap(() => this.router.navigate(['/'])),
  ),{dispatch: false});

  constructor(private actions$: Actions, private http: HttpClient, private router:Router) {}
}

import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {catchError, map, mergeMap, of, switchMap} from "rxjs";
import {Injectable} from "@angular/core";

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
          mergeMap(resData => {
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
            return of(new AuthAction.Login({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate: expirationDate
            }))
          }),
          catchError(error => {
            return of();
          })
        )
      }),
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}

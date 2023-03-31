import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {catchError, map, of, switchMap} from "rxjs";

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
      ).pipe(catchError(error => of();), map(resData => of()));
    })
  );
  constructor(private actions$: Actions, private http: HttpClient) {}
}

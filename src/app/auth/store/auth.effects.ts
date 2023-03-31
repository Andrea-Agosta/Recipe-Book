import {Actions, ofType} from "@ngrx/effects";

import * as AuthAction from "./auth.actions";

export class AuthEffects {
  authLogin = this.actions$.pipe(ofType(AuthAction.LOGIN_START));
  constructor(private actions$: Actions) {}
}

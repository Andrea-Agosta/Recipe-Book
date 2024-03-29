import {User} from "../user.model";
import * as AuthAction from "./auth.actions";

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
}

export const authReducer = (state: State = initialState, action: AuthAction.AuthAction) => {
  switch (action.type) {
    case AuthAction.AUTHENTICATE_SUCCESS:
      const user = new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate);
      return {...state, user: user, authError: null, loading: false};
    case AuthAction.LOGOUT:
      return {...state, user: null};
    case AuthAction.LOGIN_START:
    case AuthAction.SIGNUP_START:
      return  {...state, authError: null, loading: true};
    case AuthAction.AUTHENTICATE_FAIL:
      return {...state, user: null, authError: action.payload, loading: false};
    case AuthAction.CLEAR_ERROR:
      return {...state, authError: null}
    default:
      return state
  }
}

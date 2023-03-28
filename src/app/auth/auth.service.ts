import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_KEY} from "../../configSecret";
import {catchError, throwError} from "rxjs";

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    console.log('signUp', email, password);
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ API_KEY,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    )
    .pipe(catchError(errorRes => {
      let errorMessage = 'An Unknown error occurred';
      if(!errorRes.error || !errorRes.error.error) {
        return throwError(errorMessage);
      }
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already';
      }
      return throwError(errorMessage);
    }));
  }
}

import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";

import { AuthService } from "./auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if(this.isLoginMode) {
      //....
    } else {
      this.authService.signUp(email, password).subscribe(resData => {
        console.log(resData, 'resp');
        this.isLoading = false;
      }, err => {
        this.error = 'An Error occurred!';
        this.isLoading = false;
      });
    }
    form.reset();
  }
}

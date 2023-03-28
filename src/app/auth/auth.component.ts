import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";

import { AuthService } from "./auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode: boolean = true;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    console.log('form', form.value)
    if(!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    if(this.isLoginMode) {
      //....
    } else {
      this.authService.signUp(email, password).subscribe(resData => {
        console.log('HERE');
        console.log(resData, 'resp');
      }, err => {
        console.log(err, 'err');
      });
    }
    form.reset();
  }
}

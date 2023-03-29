import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";"./recipe-edit/recipe-edit.component";

import {SharedModule} from "../shared/shared.module";
import {AuthComponent} from "./auth.component";

@NgModule({
  declarations: [AuthComponent],
  imports: [FormsModule,
    RouterModule.forChild([
      { path: '', component: AuthComponent },
    ]), SharedModule],
})
export class AuthModule {
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from "@angular/common/http";
import {EffectsModule} from "@ngrx/effects";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core.module";
import {LoggingService} from "./logging.service";
import {shoppingListReducer} from "./shopping-list/store/shoping-list.reducer";
import {authReducer} from "./auth/store/auth.reducer";
import {AuthEffects} from "./auth/store/auth.effects";
import {environment} from "../enviroments/environment";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({shoppingList: shoppingListReducer, auth: authReducer}),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    SharedModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
  // providers: [LoggingService]
})
export class AppModule { }

import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Subscription} from 'rxjs';
import {Store} from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as AuthAction from "../auth/store/auth.actions";
import * as RecipesActions from "../recipes/store/recipe.actions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSub: Subscription;
  collapsed = true;

  constructor(private store: Store<fromApp.AppState>){}

  ngOnInit(){
    this.userSub = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => this.isAuthenticated = !!user);
  }

  onLogout() {
    this.store.dispatch(new AuthAction.Logout());
  }

  onSaveData() {
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}

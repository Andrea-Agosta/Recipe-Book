import {Actions, createEffect, ofType} from "@ngrx/effects";
import {map, switchMap, withLatestFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

import * as RecipesActions from "./recipe.actions";
import * as fromApp from "../../store/app.reducer";
import {Recipe} from "../recipe.model";
import {Store} from "@ngrx/store";

@Injectable()
export class RecipeEffects {
  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}

  fetchRecipes = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>('https://ng-course-recipe-book-d7f4c-default-rtdb.firebaseio.com/recipes.json')
    }),
    map(recipes => {
      return recipes.map( recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      })
    }),
    map(recipes => new RecipesActions.SetRecipes(recipes))
  ));

  storeRecipes = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(
        'https://ng-course-recipe-book-65f10.firebaseio.com/recipes.json',
        recipesState.recipes
      );
    })
  ), {dispatch: false});
}

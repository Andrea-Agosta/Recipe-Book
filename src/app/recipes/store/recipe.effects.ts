import {Actions, createEffect, ofType} from "@ngrx/effects";
import {map, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

import * as RecipesActions from "./recipe.actions";
import {Recipe} from "../recipe.model";

@Injectable()
export class RecipeEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

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
}

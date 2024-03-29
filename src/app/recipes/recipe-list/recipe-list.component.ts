import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {map, Subscription} from 'rxjs';
import {Store} from "@ngrx/store";

import { Recipe } from '../recipe.model';
import * as fromApp from "../../store/app.reducer";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscriptions: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscriptions = this.store.select('recipes')
      .pipe(map(recipesState => recipesState.recipes))
      .subscribe((recipes: Recipe[]) => this.recipes = recipes);
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

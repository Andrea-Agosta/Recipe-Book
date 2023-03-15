import {EventEmitter} from "@angular/core";
import {Recipe} from "../recipes/recipe.model";

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is simply a Test', 'https://media.istockphoto.com/id/1320857678/photo/brazilian-fish-stew-moqueca.jpg?b=1&s=170667a&w=0&k=20&c=bcE72Zq71JEVt_lfL0fYWMCMjYV4AtxHxxB4EMIZamw='),
    new Recipe('Another Test Recipe', 'This is simply a Test', 'https://media.istockphoto.com/id/1320857678/photo/brazilian-fish-stew-moqueca.jpg?b=1&s=170667a&w=0&k=20&c=bcE72Zq71JEVt_lfL0fYWMCMjYV4AtxHxxB4EMIZamw='),
  ];

  getRecipe() {
    return this.recipes.slice();
  }
}

import {Injectable} from "@angular/core";
import {Recipe} from "./recipe.model";
import {Subject} from "rxjs";

import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>;
  private recipes: Recipe[] = [];

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Lasagna',
  //     'Typical italian lasagna',
  //     'https://thecozycook.com/wp-content/uploads/2022/04/Lasagna-Recipe.jpg',
  //     [
  //       new Ingredient('Bolognese Sauce', 1),
  //       new Ingredient( 'Pasta sheet', 6)
  //     ]
  //   ),
  //   new Recipe(
  //     'Brazilian fish stew',
  //     'A super tasty fish stew!',
  //     'https://media.istockphoto.com/id/1320857678/photo/brazilian-fish-stew-moqueca.jpg?b=1&s=170667a&w=0&k=20&c=bcE72Zq71JEVt_lfL0fYWMCMjYV4AtxHxxB4EMIZamw=',
  //     [
  //       new Ingredient('Fish', 2),
  //       new Ingredient( 'Tomatoes', 2),
  //       new Ingredient( 'Onion', 1),
  //     ],
  //   ),
  //   new Recipe(
  //     'Blueberry Cheesecake',
  //     'Amazing dessert!',
  //     'https://theloopywhisk.com/wp-content/uploads/2021/01/Blueberry-Cheesecake_730px-featured.jpg',
  //     [
  //       new Ingredient('Blueberry', 20),
  //       new Ingredient( 'Cream Cheese', 1),
  //       new Ingredient( 'Sugar', 300),
  //       new Ingredient( 'Biscuit', 300),
  //     ],
  //   ),
  // ];

  constructor(private shoppingListService: ShoppingListService) {}

  setRecipes(recipes:Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe( id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients:Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipes:Recipe) {
    this.recipes.push(recipes);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe:Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}

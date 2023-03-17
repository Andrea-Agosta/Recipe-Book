import {EventEmitter, Injectable} from "@angular/core";
import {Recipe} from "../recipes/recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "./shopping-list.service";

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Lasagna',
      'Typical italian lasagna',
      'https://thecozycook.com/wp-content/uploads/2022/04/Lasagna-Recipe.jpg',
      [
        new Ingredient('Bolognese Sauce', 1),
        new Ingredient( 'Pasta sheet', 6)
      ]
    ),
    new Recipe(
      'Brazilian fish stew',
      'A super tasty fish stew!',
      'https://media.istockphoto.com/id/1320857678/photo/brazilian-fish-stew-moqueca.jpg?b=1&s=170667a&w=0&k=20&c=bcE72Zq71JEVt_lfL0fYWMCMjYV4AtxHxxB4EMIZamw=',
      [
        new Ingredient('Fish', 2),
        new Ingredient( 'Tomatoes', 2),
        new Ingredient( 'Onion', 1),
      ],
    ),
    new Recipe(
      'Blueberry Cheesecake',
      'Amazing dessert!',
      'https://theloopywhisk.com/wp-content/uploads/2021/01/Blueberry-Cheesecake_730px-featured.jpg',
      [
        new Ingredient('Blueberry', 20),
        new Ingredient( 'Cream Cheese', 1),
        new Ingredient( 'Sugar', 300),
        new Ingredient( 'Biscuit', 300),
      ],
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe( id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients:Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}

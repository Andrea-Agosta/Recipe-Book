import {Ingredient} from "../shared/ingredient.model";

const initialState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ]
};

export const shoppingListReducer = (state = initialState, action) => {

}

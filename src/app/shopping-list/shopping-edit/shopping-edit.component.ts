import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";

import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import * as ShoppingListActions from "../store/shopping-list.actions"

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode: boolean = false;
  editItemIndex: number;
  editItem: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
  ) {}

  ngOnInit() {
    this.subscription = this.shoppingListService.startEditing.subscribe( (index: number) => {
      this.editItemIndex = index;
      this.editMode = true;
      this.editItem = this.shoppingListService.getIngredient(index);
      this.slForm.setValue({
        name: this.editItem.name,
        amount: this.editItem.amount,
      });
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    this.editMode ? this.shoppingListService.updateIngredient(this.editItemIndex, newIngredient)
      : this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient)); //this.shoppingListService.addIngredient(newIngredient);
    this.editMode = false;
    form.reset();
  }

  onDelete () {
    this.shoppingListService.deleteIngredient(this.editItemIndex);
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

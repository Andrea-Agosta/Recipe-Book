import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {
  @ViewChild('nameInput', {static:false}) nameInputReference:ElementRef;
  @ViewChild('amountInput', {static:false}) amountInputReference:ElementRef;
  @Output() ingredientAdded = new EventEmitter<Ingredient>();
  onAddItem(){
    const ingName = this.nameInputReference.nativeElement.value;
    const ingAmount = this.amountInputReference.nativeElement.value;
    const newIngredient = new Ingredient(ingName, ingAmount);
    this.ingredientAdded.emit(newIngredient);
  }
}

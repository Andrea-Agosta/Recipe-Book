import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";
import {RecipesComponent} from "./recipes/recipes.component";

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipesComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
  // { path: 'not-found', component:PageNotFoundComponent},
  // { path: '**', redirectTo: '/not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

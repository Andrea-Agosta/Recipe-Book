import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import {DataStorageService} from "../shared/data-storage.service";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSub: Subscription;
  collapsed = true;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService){}

  ngOnInit(){
    this.userSub = this.authService.user.subscribe(user => this.isAuthenticated = !!user);
  }

  onLogout() {
    this.authService.logout();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class DataStoreProvider {

  constructor() { }

  isLoggedIn: boolean;
  user: string;

  getLoggedInState() {
    return this.isLoggedIn;
  }

  setLoggedInState(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }

  getUserLoggedIn() {
    return this.user;
  }

  setUserLoggedIn(user: string) {
    this.user = user;
  }

}

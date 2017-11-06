import { Injectable } from '@angular/core';

@Injectable()
export class DataStoreProvider {

  constructor() { }

  url: string;
  
    getRedirectUrl() {
      return this.url;
    }
  
    setRedirectUrl(url: string) {
      this.url = url;
    }

}

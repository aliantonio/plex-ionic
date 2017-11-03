import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingProvider {

  loader: any;
  
  constructor(public loadingCtrl: LoadingController) { }

  show() {
    console.log('showing loading module');
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  hide() {
    console.log('hiding loading module');
    this.loader.dismiss();
  }

}

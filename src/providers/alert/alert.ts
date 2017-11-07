import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';

@Injectable()
export class AlertProvider {
  
  constructor(public alertCtrl: AlertController) { }

  showAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  public showPrompt(name, title) {
    
    let prompt = this.alertCtrl.create({
      title: title,
      message: "Message for " + name,
      inputs: [
        {
          name: 'comment',
          placeholder: 'Comment'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            console.log('submit clicked');
          }
        }
      ]
    });
    prompt.present();
  }
  

}

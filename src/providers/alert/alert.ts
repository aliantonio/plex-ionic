import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { SubmitCommentsProvider } from '../submit-comments/submit-comments';

@Injectable()
export class AlertProvider {
  
  constructor(public alertCtrl: AlertController, private submitComments: SubmitCommentsProvider) { }

  showAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  public showPrompt(name: string, title: string, id?: string) {
    
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
            this.submitComments.submitComments(id, data.comment);
          }
        }
      ]
    });
    prompt.present();
  }
  

}

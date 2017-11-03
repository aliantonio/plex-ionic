import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastProvider } from '../../providers/toast/toast';

@Injectable()
export class JoinApiProvider {

  constructor(public http: HttpClient, private toast: ToastProvider) { }

  push(param: string, email?: any) {
    let deviceId = '43aa6e7b1c8b4a28904dbd5b6950e8ef'; // pixel 2
    let apiKey = '36daccd47ff14aa385a36d425ab4bc13';
    console.log('https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?text=' + param + email + '&deviceId=' + deviceId + '&apikey=' + apiKey);
    this.http.get('https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?text=' + param + email + '&deviceId=' + deviceId + '&apikey=' + apiKey)
    .subscribe(
    // Successful responses call the first callback.
    data => {
      console.log(data);
      if (data.success) {
        this.toast.showToast('Push sent successfully.');
      } else {
        this.toast.showToast('Something went wrong. Try again later.');
      }
    },
    // Errors will call this callback instead:
    err => {
      console.error(err);
    });
  
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastProvider } from '../../providers/toast/toast';

@Injectable()
export class JoinApiProvider {

  constructor(public http: HttpClient, private toast: ToastProvider) { }

  push(param: string, email?: any) {
    let deviceId = 'f70f80282ea741f190b8d80d9388f460'; // pixel 3
    let apiKey = '36daccd47ff14aa385a36d425ab4bc13';
    console.log('https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?text=' + param + email + '&deviceId=' + deviceId + '&apikey=' + apiKey);
    this.http.get('https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?text=' + param + email + '&deviceId=' + deviceId + '&apikey=' + apiKey)
    .subscribe(
    // Successful responses call the first callback.
    data => {
      console.log(data);
      if (param == "plex%20request") {
        this.toast.showToast('Success! Plex will be on shortly.');
      } else if (param == "check%20plex") {
        this.toast.showToast('Ok. I will look into it. Check back in a few minutes.');
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

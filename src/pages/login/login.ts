import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { Http, Jsonp, Response, RequestOptions, Headers  } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { LoadingProvider } from '../../providers/loading/loading';
import { DataStoreProvider } from '../../providers/data-store/data-store';
import { AlertProvider } from '../../providers/alert/alert';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccountPage } from '../account/account';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private alert: AlertProvider,
    private load: LoadingProvider, private md5: Md5, private dataStore: DataStoreProvider) {
  }

  login() {
    let user = this.user['name'];
    let pass = this.user['pass'];

    if (user == '' || pass == '' || user == undefined || pass == undefined) {
      console.log('username or password is blank');
      this.alert.showAlert('Error', 'The username and password fields cannot be empty.');
      return;
    } else {

      this.load.show();
      let encryptPass = Md5.hashStr(pass || '');
      //console.log("unencryped : " + pass + ", encrypted : " + encryptPass);

      let urlSearchParams = new URLSearchParams();
      urlSearchParams.set('name', user);
      urlSearchParams.set('password', encryptPass.toString());
      let body = urlSearchParams.toString();   

      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });

      this.callLogin(body, options)
      .subscribe(
        data => {
          console.log(data);
          if (data == null) {
            console.error('invalid credentials');
            this.alert.showAlert('Oops!', 'Your username and/or password do not match. Please try again.')
          } else {
            console.log('successfully logged in');
            console.log('localStorage auth', user);
            localStorage.setItem('userid', user);
            console.log(this.dataStore.getRedirectUrl());
            if (this.dataStore.getRedirectUrl() == undefined) {
              this.navCtrl.setRoot(AccountPage, {}, {animate: false, direction: "forward"});
            } else {
              this.navCtrl.setRoot(this.dataStore.getRedirectUrl(), {}, {animate: false, direction: "forward"});
            }
            
          }
          this.load.hide();
        },
        err => {
          console.error(err);
          this.load.hide();
        }
      );
    }
  }

  private callLogin(body, options) {
    return this.http.post('http://asliantonio.com/plex/php/login.php', body, options)
      .timeout(10000)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
  }

  private logResponse(res: Response) {
    console.log(res);
  }

  private extractData(res: Response) {
    return res.json();
  }
  
  private catchError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || "Server error.");
  }

}

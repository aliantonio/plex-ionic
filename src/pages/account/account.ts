import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  username = localStorage.getItem('userid');
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
    this.resolve();
  }

  resolve() {
    console.log('resolving state of authentication');
    if (localStorage.getItem('userid') === null) {
      console.log('user not signed in, redirecting to login page');
      //this.router.navigateByUrl('/login');
      //this.navCtrl.push(LoginPage);
      this.navCtrl.setRoot(LoginPage, {}, {animate: false, direction: "forward"});
    }
  }

  logout() {
    localStorage.clear();
    console.log('local storage cleared, user logged out');
    //this.router.navigateByUrl('/login');
    this.navCtrl.setRoot(LoginPage, {}, {animate: false, direction: "forward"});
    //this.navCtrl.push(LoginPage);
  }

}

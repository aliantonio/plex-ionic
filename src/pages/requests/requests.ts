import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { ToastProvider } from '../../providers/toast/toast';
import { Http, Jsonp, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { DataStoreProvider } from '../../providers/data-store/data-store';
import { AccountPage } from '../account/account';

@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html'
})
export class RequestsPage {

  request = {};
  requests: any;
  isLoggedIn: boolean;
  id: string;
  clicked: boolean;
  
  constructor(public navCtrl: NavController, private http: Http, private alert: AlertProvider,
    private load: LoadingProvider, private toast: ToastProvider, private dataStore: DataStoreProvider) {

  }

  ngOnInit() {
    this.subscribeToRequests();
  }

  subscribeToRequests() {
    this.load.show();
    this.getRequests()
      .subscribe(
        data => {
          console.log(data);
          this.requests = data;
          this.load.hide();
        },
        err => {
          console.error(err);
          this.load.hide();
          this.toast.showToast('Something went wrong. Please check your internet connection.');
        }
    )
  }

  getRequests() {
    return this.http.get('https://asliantonio.com/plex/php/getrequests.php')
      .timeout(10000)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
  }

  submitRequest($event) {
    let loggedIn = localStorage.getItem('userid');
    let request = this.request['title'];
    
    if ( loggedIn == null || loggedIn == undefined ) {
      this.toast.showToast('Please login before submitting your request.');
      this.navCtrl.push(AccountPage, {
        navigateBack: true
      }, {
        animate: true,
        direction: "forward"  
      });
      return;
    } else if (request === undefined) {
      this.alert.showAlert('Error', 'Please enter a request before submitting.');
    } else {
      this.load.show();

      // subscribe to call to DB
      this.dbSubmit()
      .subscribe(
        data => {
          console.log(data);
          this.request['title'] = "";
          this.requests.unshift({ "USER_ID": "" + loggedIn + "", "REQUEST": "" + request + "", "COMMENTS": "", "CMPLTD": "N" });
          this.load.hide();
          this.toast.showToast('Your request was successfully recorded.');
        },
        err => {
          console.error(err);
          this.toast.showToast('Something went wrong. Try again later.');
          this.load.hide();
        }
      )
      
    }
  }

  onEnter($event) {
    $event.preventDefault();
    this.submitRequest($event);
  }

  delete(i, id) {

    this.load.show();

    // subscribe to call to DB
    this.deleteRequest(id)
    .subscribe(
      data => {
        console.log(data);
        this.requests.splice(i, 1);
        this.load.hide();
        this.toast.showToast('Deleted successfully.');
      },
      err => {
        console.error(err);
        this.toast.showToast('Something went wrong. Try again later.');
        this.load.hide();
      }
    )
  }

  complete(id) {
   
    this.load.show();

    // subscribe to call to DB
    this.markComplete(id)
    .subscribe(
      data => {
        console.log(data);
        this.load.hide();
        this.subscribeToRequests();
        this.toast.showToast('Recorded successfully.');
      },
      err => {
        console.error(err);
        this.toast.showToast('Something went wrong. Try again later.');
        this.load.hide();
      }
    )
    
  }

  comment(name, request, id) {
    this.id = id;
    this.alert.showPrompt(name, request, id)
  }

  doRefresh(refresher) {
    console.log('refresh called', refresher);
    this.subscribeToRequests();
    refresher.complete();
  }

  private markComplete(id) {
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('id', id);
    console.log(id);
    console.log('marking complete');

    return this.http.post("https://asliantonio.com/plex/php/markcomplete.php", body.toString(), options)
      .do(this.logResponse)
      .catch(this.catchError);
  }

  private dbSubmit() {
    let loggedIn = localStorage.getItem('userid');
    let request = this.request['title'];
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('name', loggedIn);
    body.append('request', request);

    return this.http.post("https://asliantonio.com/plex/php/submitrequest.php", body.toString(), options)
      .do(this.logResponse)
      .catch(this.catchError);
  }

  private deleteRequest(id) {
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('data', id);

    return this.http.post("https://asliantonio.com/plex/php/deleterequest.php", body.toString(), options)
    .do(this.logResponse)
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

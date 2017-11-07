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
    private load: LoadingProvider, private toast: ToastProvider) {

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
        }
    )
  }

  getRequests() {
    return this.http.get('http://asliantonio.com/plex/php/getrequests.php')
      .timeout(10000)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
  }

  submitRequest($event) {
    let loggedIn = localStorage.getItem('userid');
    let request = this.request['title'];
    
    if ( loggedIn == null || loggedIn == undefined ) {
      let bool = this.alert.showPrompt('Error', 'Please login before submitting your request.');
      console.log(bool);
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

  login() {
    this.closeModal();
    //this.dataStore.setRedirectUrl('requests');
    //this.router.navigate(['login']);
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

  comment(name, title, id) {
    this.id = id;
    this.alert.showPrompt(name, title)
    //this.openModal(''+name+' : '+title+ '', '', true, true);
  }

  submitComments() {

    this.load.show();
    
    // subscribe to call to DB
    this.dbSubmitComment()
    .subscribe(
      data => {
        console.log(data);
        this.load.hide();
        //this.oComments.nativeElement.value = "";
        this.closeModal();
        this.subscribeToRequests();
        this.toast.showToast('Comment added successfully.');
      },
      err => {
        console.error(err);
        this.toast.showToast('Something went wrong. Try again later.');
        this.load.hide();
      }
    )
  }

  private markComplete(id) {
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('id', id);
    console.log(id);
    console.log('marking complete');

    return this.http.post("http://asliantonio.com/plex/php/markcomplete.php", body.toString(), options)
      .do(this.logResponse)
      .catch(this.catchError);
  }

  private dbSubmitComment() {
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('id', this.id);
    //body.append('comment', this.oComments.nativeElement.value);
   // console.log(this.id, this.oComments.nativeElement.value);

    return this.http.post("http://asliantonio.com/plex/php/submitcomment.php", body.toString(), options)
      .do(this.logResponse)
      .catch(this.catchError);
  }

  private openModal(title, message, isLoggedIn, isComments) {
    //this.modalTitle = title;
    //this.modalMsg = message;
    //this.isLoggedIn = isLoggedIn;
    //this.isComments = isComments;
    //this.modalActions.emit({ action: "modal", params: ["open"] });
  }

  closeModal() {
    //this.modalActions.emit({ action: "modal", params: ["close"] });
  }

  private dbSubmit() {
    let loggedIn = localStorage.getItem('userid');
    let request = this.request['title'];
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('name', loggedIn);
    body.append('request', request);

    return this.http.post("http://asliantonio.com/plex/php/submitrequest.php", body.toString(), options)
      .do(this.logResponse)
      .catch(this.catchError);
  }

  private deleteRequest(id) {
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('data', id);

    return this.http.post("http://asliantonio.com/plex/php/deleterequest.php", body.toString(), options)
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

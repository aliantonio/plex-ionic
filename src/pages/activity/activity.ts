import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Jsonp, Response } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { ToastProvider } from '../../providers/toast/toast';
import { LoadingProvider } from '../../providers/loading/loading';

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html'
})
export class ActivityPage {

  currentResults: string[];
  previousResults: string[];

  constructor(public navCtrl: NavController, private http: Http, private jsonp: Jsonp,
      private load: LoadingProvider, private toast: ToastProvider) { }

  ngOnInit() {
    this.load.show();
    this.subscribePrevActivity();
    this.subscribeCurrActivity();
  }

  subscribeCurrActivity() {
    this.getCurrActivity()
    .subscribe(
      data => {
        console.log(data);
        this.currentResults = data.MediaContainer.Video;
        //this.load.hide();
      },
      err => {
        console.error(err);
        //this.loader.hide();
        //toast('Something went wrong. Please check your internet connection.', 7000, 'rounded');
      }
    )
  }

  subscribePrevActivity() {
    this.getPreviousActivity()
      .subscribe(
        data => {
          console.log(data);
          this.previousResults = data;
          this.load.hide();
        },
        err => {
          console.error(err);
          this.load.hide();
          this.toast.showToast('Something went wrong. Please check your internet connection');
        }
    )
  }

  getCurrActivity() {
    return this.http.get('http://asliantonio.dyndns.org:32400/status/sessions?X-Plex-Token=MbxwPyCXzVwkYQ7ESW87')
    .timeout(10000)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError);
  }

  getPreviousActivity() {
    return this.http.get('http://asliantonio.com/plex/php/dbquery.php')
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
    //onsole.error(error);
    return Observable.throw(error || "Server error.");
  }

}

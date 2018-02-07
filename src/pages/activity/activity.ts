import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Jsonp, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { ToastProvider } from '../../providers/toast/toast';
import { LoadingProvider } from '../../providers/loading/loading';
import { DataStoreProvider } from '../../providers/data-store/data-store';
import { ActivityDetailsPage } from '../activity-details/activity-details';

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html'
})
export class ActivityPage {

  currentResults: string[];
  previousResults: string[];
  limit: any = 50;
  offset: any = 0;

  constructor(public navCtrl: NavController, private http: Http, private jsonp: Jsonp,
      private load: LoadingProvider, private toast: ToastProvider, private dataStore: DataStoreProvider) { }

  ngOnInit() {
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

  loadMore() {
    console.log('pushing');
    this.subscribeLoadMore();
    console.log(this.previousResults);
  }

  subscribeLoadMore() {
    this.load.show();
    this.getMoreResults()
      .subscribe(
        data => {
          console.log(data);
          data.forEach((obj) => {
            this.previousResults.push(obj);
          });

          this.load.hide();
        },
        err => {
          console.error(err);
          this.load.hide();
          this.toast.showToast('Something went wrong. Please check your internet connection');
        }
    )
  }

  getMoreResults() {
    this.offset = this.offset + this.limit;
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.set('limit', this.limit);
    body.set('offset', this.offset);

    return this.http.get('https://asliantonio.com/plex/php/dbquery.php', {params: body.toString()})
      .timeout(10000)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
      
  }

  subscribePrevActivity() {
    this.load.show();
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
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.set('limit', this.limit);
    body.set('offset', this.offset);

    return this.http.get('https://asliantonio.com/plex/php/dbquery.php', {params: body.toString()})
      .timeout(10000)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
  }

  navigateTo(type, user, title, showTitle, season, episode) {
    this.dataStore.setType(type);
    this.dataStore.setUser(user);
    this.dataStore.setTitle(title);
    this.dataStore.setShowTitle(showTitle);
    this.dataStore.setSeason(season);
    this.dataStore.setEpisode(episode);
    this.navCtrl.push(ActivityDetailsPage, {
      name: user,
      dtls: title
    });
  }

  doRefresh(refresher) {
    console.log('refresh called', refresher);
    this.subscribePrevActivity();
    refresher.complete();
  }

  private logResponse(res: Response) {
    console.log(res);
  }

  private extractData(res: Response) {
    return res.json();
  }
  
  private catchError(error: Response) {
    //console.error(error);
    return Observable.throw(error || "Server error.");
  }

}

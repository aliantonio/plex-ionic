import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent } from "angular-star-rating/star-rating-struct";
import { Http, Jsonp, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { LoadingProvider } from '../../providers/loading/loading';
import { DataStoreProvider } from '../../providers/data-store/data-store';
import { AlertProvider } from '../../providers/alert/alert';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-activity-details',
  templateUrl: 'activity-details.html',
})
export class ActivityDetailsPage {

  name: string;
  dtls: string;
  id: string;
  onClickResult:OnClickEvent;
  onHoverRatingChangeResult:OnHoverRatingChangeEvent;
  onRatingChangeResult: OnRatingChangeEven;
  review = {};
  usercomments: string;
  stars: number;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private jsonp: Jsonp, private alert: AlertProvider,
    private load: LoadingProvider, private dataStore: DataStoreProvider, private toast: ToastProvider) { }

  ionViewDidLoad() {
    this.name = this.navParams.get('name');
    this.dtls = this.navParams.get('dtls');
    this.subscribeMediaDetails();
  }

  onRatingChange = ($event:OnRatingChangeEven) => {
    console.log('onRatingUpdated $event: ', $event);
    this.onRatingChangeResult = $event;
  };

  onHoverRatingChange = ($event:OnHoverRatingChangeEvent) => {
      console.log('onHoverRatingChange $event: ', $event);
      this.onHoverRatingChangeResult = $event;
  };

  subscribeMediaDetails() {
    this.getMediaDetails()
      .subscribe(
        data => {
          console.log(data);
          this.id = data[0].ID;
          this.stars = data[0].STARS;
          this.review['content'] = data[0].COMMENTS;
          this.load.hide();
        },
        err => {
          console.error(err);
          this.load.hide();
        }
    )
  }

  updateRating = ($event:OnClickEvent, isComments: boolean) => {
    let loggedIn = localStorage.getItem('userid');
    if (loggedIn == null || loggedIn == undefined) {
      this.alert.showAlert('Error', 'Please login before submitting your review.');
      return;
    } else if (loggedIn != this.name) {
      this.alert.showAlert('Error', 'You cannot submit ratings for other people.');
      return;
    } else {
      console.log('onClick $event: ', $event);
      console.log("id", this.id);
      console.log("name", this.name);
      console.log("content", this.dtls);
      console.log("stars", this.stars);
      console.log("comment", this.review['content']);

      if (!isComments) { this.stars = $event.rating; }
      this.onClickResult = $event;
      this.load.show();

      // subscribe to call to DB
      this.setUserReview()
      .subscribe(
        data => {
          console.log(data);
          this.load.hide();
          this.toast.showToast('Your review was successfully recorded.');
        },
        err => {
          console.error(err);
          this.toast.showToast('Something went wrong. Try again later.');
          this.load.hide();
        }
      )

    }
  };

  login() {
    //this.closeModal();
    this.dataStore.setRedirectUrl("activity/"+this.name+"/"+this.dtls+"");
    //this.router.navigate(['login']);
  }

  private getMediaDetails() {
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('name', this.name);
    body.append('content', this.dtls);

    return this.http.post("http://asliantonio.com/plex/php/dbratequery.php", body.toString(), options)
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    
  }

  private setUserReview() {
    // make call to DB to update rating
    let commentsClean = this.review['content'].replace(/'/g, '');
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('id', this.id);
    body.append('name', this.name);
    body.append('content', this.dtls);
    body.append('rating', this.stars.toString());
    body.append('comments', commentsClean);

    return this.http.post("http://asliantonio.com/plex/php/dbupdaterating.php", body.toString(), options)
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
    return Observable.throw(error || "Server error.");
  }

}

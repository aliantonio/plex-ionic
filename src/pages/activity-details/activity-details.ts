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
import { AccountPage } from '../account/account';

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
  genre: string;
  plot: string;
  imdbId: string;
  omdbRatings: string[] = [];
  
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
          this.toast.showToast('Something went wrong. Please check your internet connection');
        }
    )
    this.getImdbRatings()
      .subscribe(
        data => {
          console.log(data);
          this.genre = data.Genre;
          this.plot = data.Plot;
          for (let i = 0; i < data.Ratings.length; i++) {
            this.omdbRatings.push(data.Ratings[i].Value);
          }

          this.imdbId = data.imdbID;
          this.load.hide();
        },
        err => {
          console.error(err);
          this.load.hide();
        }
    );
  }

  updateRating = ($event:OnClickEvent, isComments: boolean) => {
    let loggedIn = localStorage.getItem('userid');
    if (loggedIn == null || loggedIn == undefined) {
      this.toast.showToast('Please login before submitting your review.');
      this.navCtrl.push(AccountPage, {
        navigateBack: true
      }, {
        animate: true,
        direction: "forward"  
      });
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

  goToImdb() {
    console.log(this.imdbId);
    window.open('http://www.imdb.com/title/' + this.imdbId, '_system', 'location=yes');
  }

  private encode(v: string): string {
      return v
      .replace(/:/g, '')
      .replace(/@/g, '')
      .replace(/$/g, '')
      .replace(/,/g, '')
      .replace(/;/g, '')
  }  
  
  private getMediaDetails() {
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('name', this.name);
    body.append('content', this.dtls);

    return this.http.post("https://asliantonio.com/plex/php/dbratequery.php", body.toString(), options)
      .timeout(10000)  
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    
  }

  private getImdbRatings() {
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    
    if (this.dataStore.getType() === 'movie' || this.dataStore.getType() === '') {
      body.set('t', this.encode(this.dataStore.getTitle()));
    } else if (this.dataStore.getType() === 'episode') {
      body.set('t', this.dataStore.getShowTitle());
      body.set('Season', this.dataStore.getSeason().slice(7)); // remove the word season from string
      body.set('Episode', this.dataStore.getEpisode());
    }
    body.set('apikey', "288b0aab");
    
    return this.http.get("http://www.omdbapi.com/?", {params: body.toString()})
      .timeout(10000)  
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
  }

  private setUserReview() {
    // make call to DB to update rating
    let commentsClean = "";
    this.review['content'] == undefined ? commentsClean = "" : commentsClean = this.review['content'].replace(/'/g, '');
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('id', this.id);
    body.append('name', this.name);
    body.append('content', this.dtls);
    body.append('rating', this.stars.toString());
    body.append('comments', commentsClean);

    return this.http.post("https://asliantonio.com/plex/php/dbupdaterating.php", body.toString(), options)
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

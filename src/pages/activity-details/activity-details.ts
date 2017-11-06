import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent } from "angular-star-rating/star-rating-struct";

@IonicPage()
@Component({
  selector: 'page-activity-details',
  templateUrl: 'activity-details.html',
})
export class ActivityDetailsPage {

  name: string;
  dtls: string;
  onClickResult:OnClickEvent;
  onHoverRatingChangeResult:OnHoverRatingChangeEvent;
  onRatingChangeResult: OnRatingChangeEven;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.name = this.navParams.get('name');
    this.dtls = this.navParams.get('dtls');
  }

  onRatingChange = ($event:OnRatingChangeEven) => {
    console.log('onRatingUpdated $event: ', $event);
    this.onRatingChangeResult = $event;
  };

  onHoverRatingChange = ($event:OnHoverRatingChangeEvent) => {
      console.log('onHoverRatingChange $event: ', $event);
      this.onHoverRatingChangeResult = $event;
  };

}

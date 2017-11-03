import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Jsonp } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/Rx';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { JoinApiProvider } from '../../providers/join-api/join-api';
import { PingServerProvider } from '../../providers/ping-server/ping-server';
import { LoadingProvider } from '../../providers/loading/loading';

@Component({
  selector: 'page-status',
  templateUrl: 'status.html'
})
export class StatusPage {

  private alive: boolean;
  isPoweredOn: boolean;
  private requestSent: boolean;
  private reportSent: boolean;

  constructor(public navCtrl: NavController, private http: Http, private ping: PingServerProvider,
            private joinApi: JoinApiProvider, private jsonp: Jsonp, private load: LoadingProvider) {
    this.alive = true;
    this.requestSent = false;
    this.reportSent = false;
  }

  ngOnInit() {
    this.alive = true;
    this.load.show();
    this.checkStatus();
  }

  checkStatus() {
    Observable.timer(0, 5000) // 5 seconds
    .takeWhile(() => this.alive)
    .subscribe(() => {
      this.ping.ping()
        .subscribe((data) => {
          console.log(data);
          this.isPoweredOn = true;
          this.load.hide();
        },
        err => {
          this.ngOnDestroy();
          console.error(err + " - computer is likely not powered on.");
          this.isPoweredOn = false;
          this.load.hide();
      });
    });
  }

  ngOnDestroy() {
    console.log('destroying http requests');
    this.alive = false;
  }

  powerOn() {
    console.log('power button triggered');
    this.joinApi.push("plex%20request");
    this.requestSent = true;
  }

  report() {
    if ( this.reportSent ) {
//      toast("A report has already been sent.", 4000, 'rounded');
    } else {
      console.log('power button triggered');
      this.joinApi.push("check%20plex");
      this.reportSent = true;
    }
  }

}

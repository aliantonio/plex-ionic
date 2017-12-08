import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';

@Injectable()
export class PingServerProvider {

  constructor(public http: Http) { }

  ping() {
    return this.http.get('https://asliantonio.com/dashboard/pingserver.php')
      .timeout(5000)
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
    //console.error(error.statusText);
    return Observable.throw(error.statusText || "Server error.");
  }

}

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Jsonp, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastProvider } from '../../providers/toast/toast';

@Injectable()
export class SubmitCommentsProvider {

  constructor(public http: Http, private load: LoadingProvider, private toast: ToastProvider) { }

  submitComments(id: string, comments: string) {
    
        this.load.show();
        
        // subscribe to call to DB
        this.dbSubmitComment(id, comments)
        .subscribe(
          data => {
            console.log(data);
            this.load.hide();
          //  this.subscribeToRequests();
            this.toast.showToast('Comment added successfully.');
          },
          err => {
            console.error(err);
            this.toast.showToast('Something went wrong. Try again later.');
            this.load.hide();
          }
        )
      }

  private dbSubmitComment(id: string, comments: string) {
    let body = new URLSearchParams();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    body.append('id', id);
    body.append('comment', comments);

    return this.http.post("http://asliantonio.com/plex/php/submitcomment.php", body.toString(), options)
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

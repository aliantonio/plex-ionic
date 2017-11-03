import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {

  transform(utcDate: any): any {
    //console.log('dateFormat:', utcDate);
    var t = utcDate.split(/[- :]/);
    //console.log(parseInt(t[3]) + parseInt(3)); change to + 6 for DST
    var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], parseInt(t[3]) + parseInt('7'), t[4], t[5]));
    return d;
  }

}

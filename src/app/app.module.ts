import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';

import { ActivityPage } from '../pages/activity/activity';
import { RequestsPage } from '../pages/requests/requests';
import { StatusPage } from '../pages/status/status';
import { TabsPage } from '../pages/tabs/tabs';
import { AccountPage } from '../pages/account/account';
import { ActivityDetailsPage } from '../pages/activity-details/activity-details';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PingServerProvider } from '../providers/ping-server/ping-server';
import { JoinApiProvider } from '../providers/join-api/join-api';
import { LoadingProvider } from '../providers/loading/loading';
import { ToastProvider } from '../providers/toast/toast';
import { DateFormatPipe } from '../pipes/date-format/date-format';

import { StarRatingModule } from 'angular-star-rating';
import { Md5 } from 'ts-md5/dist/md5';
import { DataStoreProvider } from '../providers/data-store/data-store';
import { AlertProvider } from '../providers/alert/alert';
import { SubmitCommentsProvider } from '../providers/submit-comments/submit-comments';

@NgModule({
  declarations: [
    MyApp,
    ActivityPage,
    RequestsPage,
    StatusPage,
    TabsPage,
    AccountPage,
    DateFormatPipe,
    ActivityDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    JsonpModule,
    StarRatingModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ActivityPage,
    RequestsPage,
    StatusPage,
    TabsPage,
    AccountPage,
    ActivityDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PingServerProvider,
    JoinApiProvider,
    LoadingProvider,
    ToastProvider,
    Md5,
    DataStoreProvider,
    AlertProvider,
    SubmitCommentsProvider
  ]
})
export class AppModule {}

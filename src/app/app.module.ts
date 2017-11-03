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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PingServerProvider } from '../providers/ping-server/ping-server';
import { JoinApiProvider } from '../providers/join-api/join-api';
import { LoadingProvider } from '../providers/loading/loading';
import { ToastProvider } from '../providers/toast/toast';
import { DateFormatPipe } from '../pipes/date-format/date-format';

@NgModule({
  declarations: [
    MyApp,
    ActivityPage,
    RequestsPage,
    StatusPage,
    TabsPage,
    AccountPage,
    DateFormatPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ActivityPage,
    RequestsPage,
    StatusPage,
    TabsPage,
    AccountPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PingServerProvider,
    JoinApiProvider,
    LoadingProvider,
    ToastProvider
  ]
})
export class AppModule {}

import { Component } from '@angular/core';

import { ActivityPage } from '../activity/activity';
import { RequestsPage } from '../requests/requests';
import { StatusPage } from '../status/status';
import { AccountPage } from '../account/account';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StatusPage;
  tab2Root = ActivityPage;
  tab3Root = RequestsPage;
  tab4Root = AccountPage;

  constructor() {

  }
}

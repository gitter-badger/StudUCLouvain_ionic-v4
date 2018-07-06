/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Daubry Benjamin & Marchesini Bruno
    Date : July 2018
    This file is part of UCLCampus
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

    UCLCampus is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    UCLCampus is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with UCLCampus.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Component } from '@angular/core';
import { NavParams, NavController, App, AlertController, LoadingController, FabContainer} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
import { AppAvailability } from '@ionic-native/app-availability';
import { MyApp } from '../../app/app.component';
import { Market } from '@ionic-native/market';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../../providers/utils-services/user-service';

import { EventsPage } from '../events/events';
import { MobilityPage } from '../mobility/mobility';
import { LibrariesPage } from '../library/libraries';
import { NewsPage } from '../news/news';
import { RestaurantPage } from '../restaurant/restaurant';
import { StudiesPage } from '../studies/studies';
import { MapPage } from '../map/map';
import { SupportPage } from '../help-desk/support';
import { SportsPage } from '../sports/sports';
import { GuindaillePage } from '../guindaille2-0/guindaille2-0';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  
})
export class HomePage {

  title:string = "Accueil";
  shownGroup = null;
  where = "";
  myApp : MyApp;

  libraryPage = { title: 'MENU.LIBRARY', component: LibrariesPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  newsPage = { title: 'MENU.NEWS', component: NewsPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  eventPage = { title: 'MENU.EVENTS', component: EventsPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  sportPage = { title: 'MENU.SPORTS', component: SportsPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  studiesPage = { title: 'MENU.STUDIES', component: StudiesPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  helpDeskPage = { title: 'MENU.HELP', component: SupportPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  mapPage = { title: 'MENU.MAP', component: MapPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  guindaillePage = { title: 'MENU.PARTY', component: GuindaillePage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  restoPage = { title: 'MENU.RESTAURANT', component: RestaurantPage,
    iosSchemaName: 'com.apptree.resto4u',
    androidPackageName: 'com.apptree.resto4u',
    appUrl: 'apptreeresto4u://',
    httpUrl: 'https://uclouvain.be/fr/decouvrir/resto-u' };

  mobilityPage = { title: 'MENU.MOBILITY', component: MobilityPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };


  constructor(public navParams: NavParams,
              public app: App,
              public userS:UserService,
              public nav : NavController,
              private iab: InAppBrowser,
              private appAvailability: AppAvailability,
              private device: Device,
              private alertCtrl : AlertController,
              private translateService: TranslateService,
              public market: Market,
              public loadingCtrl: LoadingController)
  {
      if(this.navParams.get('title') !== undefined) {
        this.title = this.navParams.get('title');
      }

      this.app.setTitle(this.title);
  }

  updateCampus(){
    this.userS.addCampus(this.where);
  }

  changePage(page) {
    if(page.iosSchemaName != null && page.androidPackageName != null){
      this.launchExternalApp(page);
    }
    this.nav.push(page.component, {title: page.title});
  }

  launchExternalApp(page) {
    let app: string;
    let storeUrl:string;
    if (this.device.platform === 'iOS') {
      app = page.iosSchemaName;
      storeUrl=page.httpUrl;
    } else if (this.device.platform === 'Android') {
      app = page.androidPackageName;
      storeUrl= 'market://details?id='+ app;
    } else {
      const browser = this.iab.create(page.httpUrl, '_system');
      browser.close();
    }
    this.appAvailability.check(app).then(
      () => { // success callback
        const browser = this.iab.create(page.appUrl, '_system');
        browser.close();
      },
      () => { // error callback
        this.market.open(app);
      }
    );
  }

  public openURL(url: string, fab: FabContainer) {
    this.iab.create(url, '_system');
    fab.close();
  }

  languageChanged(event:string) {
        this.translateService.use(event);
  }

  settings(){
    let check = this.userS.campus;
    let check2 = this.translateService.currentLang;
    let settings, message, save, message2, fr, en:string;
    this.translateService.get('HOME.SETTINGS').subscribe((res:string) => {settings=res;});
    this.translateService.get('HOME.MESSAGE').subscribe((res:string) => {message=res;});
    this.translateService.get('HOME.SAVE').subscribe((res:string) => {save=res;});
    this.translateService.get('HOME.MESSAGE2').subscribe((res:string) => {message2=res;});
    this.translateService.get('HOME.FR').subscribe((res:string) => {fr=res;});
    this.translateService.get('HOME.EN').subscribe((res:string) => {en=res;});

    let settingsAlert = this.alertCtrl.create({
            title: settings,
            message: message,
            inputs : [
                {
                    type:'radio',
                    label:'Louvain-la-Neuve',
                    value:'LLN',
                    checked:(check == 'LLN')
                },
                {
                    type:'radio',
                    label:'Woluwé',
                    value:'Woluwe',
                    checked:(check == 'Woluwe')
                },
                {
                    type:'radio',
                    label:'Mons',
                    value:'Mons',
                    checked:(check == 'Mons')
                }],
            buttons: [
                {
                    text: save,
                    handler: data => {
                      this.userS.addCampus(data);
                      languageAlert.present();
                    }
                }
            ]
        });
        settingsAlert.present();

        let languageAlert = this.alertCtrl.create({
          title: settings,
          message : message2,
          inputs : [
            {
              type:'radio',
              label:fr,
              value:'fr',
              checked:(check2 == 'fr')
            },
            {
              type:'radio',
              label:en,
              value:'en',
              checked:(check2 == 'en')
            }
          ],
          buttons: [
          {
            text:save,
            handler:data => {
               this.languageChanged(data);
            }
          }]
        });

  }

  emergency(){
    let close :string;
    this.translateService.get('HOME.CLOSE').subscribe((res:string) => {close=res;});
    let urg:string;
    this.translateService.get('HOME.URG').subscribe((res:string) => {urg=res;});
    let msg1,msg2,msg3,msg4,msg5,msg6,msg7,msg8,msg9 : string;
    this.translateService.get('GUINDAILLE.HELP1').subscribe((res:string) => {msg1=res;});
    this.translateService.get('GUINDAILLE.HELP2').subscribe((res:string) => {msg2=res;});
    this.translateService.get('GUINDAILLE.HELP3').subscribe((res:string) => {msg3=res;});
    this.translateService.get('GUINDAILLE.HELP4').subscribe((res:string) => {msg4=res;});
    this.translateService.get('GUINDAILLE.HELP5').subscribe((res:string) => {msg5=res;});
    this.translateService.get('GUINDAILLE.HELP6').subscribe((res:string) => {msg6=res;});
    this.translateService.get('GUINDAILLE.HELP7').subscribe((res:string) => {msg7=res;});
    this.translateService.get('GUINDAILLE.HELP8').subscribe((res:string) => {msg8=res;});
    this.translateService.get('GUINDAILLE.HELP9').subscribe((res:string) => {msg9=res;});
    let alert = this.alertCtrl.create({
      title: urg,
      message: "<p> <strong>" + msg1 + "</strong>: <a href=\"tel:112\">112</a> </p> <p><strong>" + msg2 + "</strong>: <a href=\"tel:+32 10 47 22 22\">+32 10 47 22 22</a> </p> <p> <br>" + msg3 + " <br><br> <strong>" + msg4 + "</strong> " + msg5 + "<br> <strong>" + msg6 + "</strong> " + msg7 + "<br> <strong>" + msg8 + "</strong> " + msg9 +"<br>",
      buttons: [
      {
        text:close,
        handler:data => {
        }
      }]
    });
    alert.present();
  }

}

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

import { Component, ViewChild } from '@angular/core';
import { App, AlertController, ItemSliding, List,
  ModalController, NavParams, ToastController, LoadingController, NavController} from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
import { FormControl } from '@angular/forms';
import { IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/debounceTime';

import { UserService } from '../../providers/utils-services/user-service';
import { SportsService } from '../../providers/rss-services/sports-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';

import { SportItem } from '../../app/entity/sportItem';

@IonicPage()
@Component({
  selector: 'page-sports',
  templateUrl: 'sports.html'
})

export class SportsPage {
  @ViewChild('sportsList', { read: List }) sportsList: List;

  sports: Array<SportItem> = [];
  teams: Array<SportItem> = [];
  searching: any = false;
  segment = 'all';
  shownSports = 0;
  shownTeams = 0;
  title: any;
  searchTerm: string = '';
  searchControl: FormControl;
  filters : any = [];
  filtersT : any = [];
  excludedFilters : any = [];
  displayedSports : Array<SportItem> = [];
  displayedSportsD :any = [];
  dateRange: any = 1;
  dateLimit: Date = new Date();
  campus:string;
  shownGroup = null;
  loading;
  nosport:any = false;

  constructor(
    public alertCtrl: AlertController,
    public app:App,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private sportsService: SportsService,
    public user: UserService,
    public toastCtrl: ToastController,
    private calendar: Calendar,
    public connService : ConnectivityService,
    private translateService: TranslateService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController)
  {
    this.title = this.navParams.get('title');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.app.setTitle(this.title);
    this.updateDateLimit();
    this.loadSports();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.updateDisplayedSports();
    });
    this.presentLoading();
  }

  public doRefresh(refresher) {
    this.loadSports();
    refresher.complete();
  }

  presentLoading() {
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      this.loading.present();
    }
  }

  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
  }

  public onSearchInput(){
    this.searching = true;
  }

  public loadSports() {
    console.log("loadsports");
    this.searching = true;
    this.sportsList && this.sportsList.closeSlidingItems();
    let result: any;
    this.campus = this.user.campus;
    if(this.connService.isOnline()) {
      this.sportsService.getSports(this.segment).then(
        res => {
          result = res;
          this.sports = result.sports;
          this.shownSports = result.shownSports;
          this.filters = result.categories;
          this.searching = false;
          this.updateDisplayedSports();
      })
      .catch(error => {
        if(error == 1) {
          this.loadSports();
        } else {
          if(error == 2) {
            console.log("Loading sports : YQL req timed out > limit, suppose no sports to be displayed");
          } else {
            console.log("Error loading sports : " + error);
          }
          this.searching = false;
          this.nosport=true;
          this.updateDisplayedSports();
        }
      });

      this.sportsService.getTeams(this.segment).then(
        res => {
          result = res;
          this.teams = result.teams;
          this.shownTeams = result.shownTeams;
          this.filtersT = result.categoriesT;
          this.searching = false;
          this.updateDisplayedSports();
      })
      .catch(error => {
        if(error == 1) {
          this.loadSports();
        } else {
          if(error == 2) {
            console.log("Loading teams : YQL req timed out > limit, suppose no sports to be displayed");
          } else {
            console.log("Error loading teams : " + error);
          }
          this.searching = false;
          this.nosport=true;
          this.updateDisplayedSports();
        }
      });

    } else {
      this.searching = false;
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

//SORT SPORTS BY DAY
  public changeArray(array){
    var groups = array.reduce(function(obj,item){
      obj[item.jour] = obj[item.jour] || [];
      obj[item.jour].push(item);
      return obj;
    }, {});
    var sportsD = Object.keys(groups).map(function(key){
    return {jour: key, name: groups[key]};
    });
    return sportsD;
  }

  toggleGroup(group) {
      if (this.isGroupShown(group)) {
          this.shownGroup = null;
      } else {
          this.shownGroup = group;
      }
  }

  isGroupShown(group) {
      return this.shownGroup === group;
  }


  public updateDisplayedSports() {
    this.searching = true;
    this.sportsList && this.sportsList.closeSlidingItems();

    if (this.segment === 'all') {
      this.displayedSports = this.sports.filter((item) => {
        return ( this.excludedFilters.indexOf(item.sport) < 0 ) && (item.sport.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
            && (Math.floor(item.date.getTime()/86400000) <= Math.floor(this.dateLimit.getTime()/86400000));
      });

    } else if (this.segment === 'favorites') {
      let favSports = [];

      this.sports.filter((item) => {
        if(item.favorite || this.user.hasFavoriteS(item.guid)) {
          if(item.sport.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
            favSports.push(item);
          }
        }
      });

      this.displayedSports = favSports;
    }
    else if (this.segment === 'team') {
      this.displayedSports = this.teams.filter((item) => {
        return ( this.excludedFilters.indexOf(item.sport) < 0 ) && (item.sport.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
            && (Math.floor(item.date.getTime()/86400000) <= Math.floor(this.dateLimit.getTime()/86400000));
      });
    }

    this.shownSports = this.displayedSports.length;
    this.searching = false;
    this.displayedSportsD = this.changeArray(this.displayedSports);
    this.dismissLoading();

  }


  presentFilter() {
    if(this.filters === undefined){
      this.filters = [];
    }

    let modal = this.modalCtrl.create('SportsFilterPage',
                  { excludedFilters : this.excludedFilters, filters : this.filters, dateRange : this.dateRange});
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        let tmpRange = data.pop();
        if(tmpRange !== this.dateRange) {
          this.dateRange = tmpRange;
          this.updateDateLimit();
        }
        this.excludedFilters = data.pop();
        this.updateDisplayedSports();
      }
    });

  }

  private updateDateLimit(){
    let today = new Date();
    this.dateLimit = new Date(today.getFullYear(), today.getMonth()+this.dateRange, today.getUTCDate()+1);
  }

  addToCalendar(slidingItem: ItemSliding, itemData: SportItem){

    let options:any = {
    };

    this.calendar.createEventWithOptions(itemData.sport, itemData.lieu,
      itemData.salle, itemData.date, itemData.hfin, options).then(() => {
        let toast = this.toastCtrl.create({
          message: 'Sport créé',
          duration: 3000
        });
        toast.present();
        slidingItem.close();
      });
  }

  addFavorite(slidingItem: ItemSliding, itemData: SportItem) {
    if (this.user.hasFavoriteS(itemData.guid)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      let message:string;
      this.translateService.get('SPORTS.MESSAGEFAV').subscribe((res:string) => {message=res;});
      this.removeFavorite(slidingItem, itemData, message);
    } else {
      // remember this session as a user favorite
      this.user.addFavoriteS(itemData.guid);
      let message:string;
      this.translateService.get('SPORTS.FAVADD').subscribe((res:string) => {message=res;});

      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
      slidingItem.close();
    }

  }

  removeFavorite(slidingItem: ItemSliding, itemData: SportItem, title: string) {
    let message:string;
    let delet:string;
    let cancel:string;
    this.translateService.get('SPORTS.MESSAGEFAV2').subscribe((res:string) => {message=res;});
    this.translateService.get('SPORTS.CANCEL').subscribe((res:string) => {cancel=res;});
    this.translateService.get('SPORTS.DEL').subscribe((res:string) => {delet=res;});
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: cancel,
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: delet,
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavoriteS(itemData.guid);
            this.updateDisplayedSports();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

}

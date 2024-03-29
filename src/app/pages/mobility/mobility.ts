/**
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors: Benjamin Daubry & Bruno Marchesini and Jérôme Lemaire & Corentin Lamy
    Date: 2018-2019
    This file is part of Stud.UCLouvain
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

    Stud.UCLouvain is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Stud.UCLouvain is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Stud.UCLouvain.  If not, see <http://www.gnu.org/licenses/>.
*/
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '../../services/utils-services/utils-services';

export class StructPage {
  title: string; component: string; iosSchemaName: string; androidPackageName: string; appUrl: string; httpUrl: string;
}

@Component({
  selector: 'page-mobility',
  templateUrl: 'mobility.html',
  styleUrls: ['./mobility.scss'],
})

export class MobilityPage {
  public title: any;
  carpoolingPage: StructPage;
  busPage: StructPage;
  trainPage: StructPage;
  public platform: any;

  constructor(
    private translateService: TranslateService,
    public utilsServices: UtilsService,
    private _platform: Platform
  ) {
    this.platform = this._platform;
    this.title = 'Mobilité';
      let titlecar = 'NO_TITLE';
    this.translateService.get('MOBI.COVOIT').subscribe((res: string) => { titlecar = res; });
    console.log('After translate in constructor ! First !');
    // Information to launch external app
    this.carpoolingPage = {
      title: titlecar, component: 'CarpoolingPage',
      iosSchemaName: 'id1143545052',
      androidPackageName: 'net.commuty.mobile',
      appUrl: 'commutynet://', httpUrl: 'https://app.commuty.net/sign-in'
    };
    this.busPage = {
      title: 'NextRide', component: 'BusPage',
      iosSchemaName: 'id568042532',
      androidPackageName: 'be.thomashermine.prochainbus',
      appUrl: 'nextride://', httpUrl: 'https://nextride.be/timetables'
    };
    this.trainPage = {
      title: 'SNCB', component: 'TrainPage',
      iosSchemaName: 'id403212064',
      androidPackageName: 'de.hafas.android.sncbnmbs',
      appUrl: 'sncb://', httpUrl: 'http://www.belgianrail.be/fr/service-clientele/outils-voyage.aspx'
    };
  }
}

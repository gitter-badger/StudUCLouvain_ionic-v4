import { HttpClient } from '@angular/common/http';
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
import { Injectable } from '@angular/core';

import { Wso2Service } from './wso2-service';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
  activities: Array<String> = [];
  url = 'my/v0/student/';
  options: any;
  courseUrl = 'learning/v1/learningUnits/';

  constructor(public http: HttpClient, private wso2Service: Wso2Service) {
  }

  public searchActivities() {
    this.activities = [];
    let newUrl = this.url;
    newUrl += 'activities';
    return new Promise(resolve => {
      this.wso2Service.loadStudent(newUrl).subscribe(
        data => {
          if (data['activities'] !== null) {
            resolve({ activities: data['activities'] });
          }
        });
    });
  }

  public checkCourse(sigle: string, year) {
    const newUrl = this.courseUrl + year + '/' + sigle + '/fullInformation';
    return new Promise(resolve => {
      this.wso2Service.load(newUrl).subscribe(
        (data) => {
          let res: any;
          res = data;
          resolve(res.ficheActivite);
        },
        (err) => {
          console.log(err);
          resolve(err.status);
        });
    });
  }

  getStatus() {
    const newUrl = this.url + 'inscriptions';
    return new Promise(resolve => {
      this.wso2Service.loadStudent(newUrl).subscribe(
        (data: any) => {
          let res: any;
          res = data.lireInscriptionAnacResponse;
          resolve(res == null ? undefined : res.return);
        },
        (err) => {
          console.log(err);
          resolve(err.status);
        });
    });
  }
}

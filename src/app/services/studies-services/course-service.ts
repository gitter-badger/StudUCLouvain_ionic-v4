/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors : Benjamin Daubry & Bruno Marchesini and Jérôme Lemaire & Corentin Lamy
    Date : 2018-2019
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
import { HttpClient } from '@angular/common/http';
import { AdeService } from './ade-service';

import { Activity } from '../../entity/activity';

@Injectable({ 
  providedIn: 'root' 
})
export class CourseService {

    space = '<br>&nbsp;&nbsp;&nbsp;&nbsp;';
    constructor(
      public http: HttpClient,
      public ade : AdeService) {
    }

    /*Get the course ID for the acronym of the course*/
    getCourseId(sessionId : string, acronym : string) {
      return new Promise <string>( (resolve, reject) => {
        this.ade.httpGetCourseId(sessionId, acronym).subscribe(
          data => {
            resolve(this.extractCourseId(data));
          }
        )
      })
    }

    /*Extract the course ID*/
    extractCourseId(data) {
      if (data.resources.resource !== undefined) {
        return data.resources.resource._id;
      }
    }

    /*Get activity for a course ID obtained by getting this from a course selected by the user*/
    getActivity(sessionId : string, courseId : string) {
      return new Promise <Activity[]>( (resolve, reject) => {
        this.ade.httpGetActivity(sessionId, courseId).subscribe(
          data => {
            resolve(this.extractActivity(data));
          }
        )
      })
    }

    /*Extract the activity*/
    extractActivity(data): Activity[]{
      let activities : Activity[] = [];
      if(data.activities !== undefined) {
        let activitiesList = data.activities.activity
        if(activitiesList.length=== undefined) {
           activitiesList = [];
           activitiesList.push(data.activities.activity)
         }
        for (let i =0; i< activitiesList.length ;i++) {
          let activityElem = activitiesList[i];
          let newActivities : Activity[] = this.createNewActivities(activityElem);
          activities = activities.concat(newActivities);
        }
      }
      return activities;
    }

    /*For each activity collect the right variables to be able to display them*/
    createNewActivities(jsonActivity): Activity[] {
      let activities : Activity[] = [];
      let type : string = jsonActivity._type;
      let isExam = type.indexOf('Examen') !== -1;
      let events = jsonActivity.events.event;
      if(events !== undefined) {
        events = this.handleSpecialCase(events);
        
        for(let i=0; i<events.length; i++) {
          let event = events[i];
          let endHour = event._endHour;
          let startHour = event._startHour;
          let date = event._date;
          let participants = event.eventParticipants.eventParticipant
          const { teachers, students, auditorium } = this.getItems(participants)
          let start = this.createDate(date, startHour);
          let end = this.createDate(date, endHour);
          let name = event.$.name;
          let activity = new Activity(type, teachers, students, start, end, auditorium,isExam,name);
          activities.push(activity);
        }
      }
      return activities;
    }

  private handleSpecialCase(events: any) {
    if (events.length === undefined) {
      let temp = events;
      events = [];
      events.push(temp);
    }
    return events;
  }

    /*Create a date*/
    createDate(date : string, hour : string): Date{
      let splitDate = date.split('/')
      let splitHour = hour.split(':')
      let newdate : Date = new Date(parseInt(splitDate[2]),
                            parseInt(splitDate[1])-1,
                            parseInt(splitDate[0]),
                            parseInt(splitHour[0]),
                            parseInt(splitHour[1])
                            );
      return newdate;
    }

    getItems(participants) {
      let students: string = '';
      let teachers: string = '';
      let auditorium: string = '';
      for (let i=0; i < participants.length; i++) {
        ({ students, auditorium, teachers } = this.fillItems(participants, i, students, auditorium, teachers));
      }
      students = students.substr(0,students.length-28);
      return { teachers, students, auditorium };
    }


  private fillItems(participants: any, i: number, students: string, auditorium: string, teachers: string) {
    if (participants[i]._category === 'trainee') {
      students = students + participants[i]._name + this.space;
    }
    if (participants[i]._category === 'classroom') {
      auditorium = auditorium + participants[i]._name + ' ';
    }
    if (participants[i]._category === 'instructor') {
      teachers = teachers + participants[i]._name + '/';
    }
    return { students, auditorium, teachers };
  }
}

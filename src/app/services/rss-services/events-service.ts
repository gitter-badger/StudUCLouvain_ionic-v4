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

import { EventItem } from '../../entity/eventItem';
import { UserService } from '../utils-services/user-service';
import { RssService } from './rss-service';

@Injectable()
export class EventsService {
  events: Array<EventItem> = [];
  allCategories: any = [];
  shownEvents = 0;
    url = 'https://louvainfo.be/calendrier/feed/calendar';

  constructor(public user: UserService, public rssService: RssService) { }

  /*Get the events*/
  public getEvents(segment: string, searching: boolean) {
    this.events = [];
    return this.rssService.loadItems(segment, this.url, this.extractEvents.bind(this), searching);
  }

  /*Extraction of events*/
  private extractEvents(data: any) {
    this.shownEvents = 0;
    const maxDescLength = 20;
    if (data === undefined) {
      console.log('Error events data undefined!!!');
      return;
    }
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const { trimmedDescription, hidden, favorite, startDate, endDate, iconCategory } = this.getEventsData(item, maxDescLength);
      this.shownEvents++;
      const newEventItem = new EventItem(item.description, item.link, item.title, item.photo, trimmedDescription, item.location,
        hidden, favorite, item.guid, startDate, endDate, item.category, iconCategory);
      this.events.push(newEventItem);
    }
    return {
      items: this.events,
      shownItems: this.shownEvents,
      categories: this.allCategories
    };
  }

  private getEventsData(item: any, maxDescLength: number) {
    const trimmedDescription = item.description.length > maxDescLength ? item.description.substring(0, 80) + '...' : item.description;
    let favorite = false;
    const hidden = false;
    let iconCategory = 'assets/icon/events-icon/other.png';
    if (this.user.hasFavorite(item.guid)) {
      favorite = true;
    }
    if (item.category) {
      if (this.allCategories.indexOf(item.category) < 0) {
        this.allCategories.push(item.category);
      }
      iconCategory = 'assets/icon/events-icon/' + this.getIconCategory(item.category) + '.png';
    }
    const startDate = this.createDateForEvent(item.date_begin);
    const endDate = this.createDateForEvent(item.date_end);
    return { trimmedDescription, hidden, favorite, startDate, endDate, iconCategory };
  }

  /*Get the good icon for a catagory*/
  public getIconCategory(category: string): string {
    switch (category.toLowerCase()) {
      case 'sensibilisation': return 'sensibilisation';
      case 'animation': return 'animation';
      case 'culturel et artistique': return 'cultural';
      case 'guindaille': return 'party';
      case 'sportif': return 'sports';
      case 'services et aides': return 'services';
      default: return 'other';
    }
  }

  /*Return a date in good form by splitting for the event*/
  private createDateForEvent(str: string): Date {
    // new Date(Year: number, (month-1): number, day: number)
    const dateTimeSplit = str.split(' ');
    const dateSplit = dateTimeSplit[0].split('/');
    const timeSplit = dateTimeSplit[1].split(':');

    const year = parseInt(dateSplit[2], 10);
    const month = parseInt(dateSplit[1], 10) - 1;
    const day = parseInt(dateSplit[0], 10);
    const hours = parseInt(timeSplit[0], 10);
    const minutes = parseInt(timeSplit[1], 10);

    return new Date(year, month, day, hours, minutes);
  }
}

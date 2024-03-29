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

import { NewsItem } from '../../entity/newsItem';
import { RssService } from './rss-service';

@Injectable()
export class NewsService {
  url1 = 'https://uclouvain.be/actualites/p1/rss';
  url2 = 'https://uclouvain.be/actualites/p2/rss';
  url3 = 'https://uclouvain.be/actualites/p3/rss';

  news = [];
  shownNews = 0;

  constructor(public http: HttpClient, public rssService: RssService) {
  }


  /*Get the appropriate news in function of the tab in which the user is*/
  public getNews(segment: string, searching: boolean) {
    let baseURL;
    this.news = [];
    switch (segment) {
      case 'P2': {
        baseURL = this.url2;
        break;
      }
      case 'P3': {
        baseURL = this.url3;
        break;
      }
      case 'P1': {
        baseURL = this.url1;
        break;
      }
      default: {
        baseURL = segment;
        break;
      }
    }
    return this.rssService.loadItems(segment, baseURL, this.extractNews.bind(this), searching);
  }

  /*Extract news*/
  private extractNews(data: any) {
    if (data.length === undefined) {
      const temp = data;
      data = [];
      data.push(temp);
    }
    this.shownNews = 0;
    const maxDescLength = 20;
    this.fillNews(data, maxDescLength);
    return {
      items: this.news,
      shownItems: this.shownNews
    };
  }

  private fillNews(data: any, maxDescLength: number) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const trimmedDescription = this.getTrimmedDescription(item, maxDescLength);
      const hidden = false;
      this.shownNews++;
      const pubDate = this.createDateForNews(item.pubDate);
      const img = item.enclosure ? this.getImg(item) : '';
      const newNewsItem = new NewsItem(
        item.description || 'No description...',
        item.link || 'No link',
        item.title || 'No title',
        img,
        trimmedDescription,
        hidden,
        item.guid,
        pubDate
      );
      this.news.push(newNewsItem);
    }
  }

  private getImg(item: any) {
    let img = '';
    if (item.enclosure !== null) {
      img = item.enclosure.$.url;
    }
    return img;
  }

  private getTrimmedDescription(item: any, maxDescLength: number) {
    let trimmedDescription = '...';
    if (item.description !== undefined) {
      trimmedDescription = item.description.length > maxDescLength ? item.description.substring(0, 80) + '...' : item.description;
    }
    return trimmedDescription;
  }

  /*Return a date in good form by splitting for the new*/
  private createDateForNews(str: string): Date {
    // str: 'Fri, 07 Jul 2017 08:51:52 +0200'
    // new Date(Year: number, (month-1): number, day: number)
    const dateTimeSplit = str.split(' ');
    const timeSplit = dateTimeSplit[4].split(':');

    const year = parseInt(dateTimeSplit[3], 10);
    const month = this.getMonthNumber(dateTimeSplit[2]);
    const day = parseInt(dateTimeSplit[1], 10);
    const hours = parseInt(timeSplit[0], 10);
    const minutes = parseInt(timeSplit[1], 10);

    return new Date(year, month, day, hours, minutes);
  }

  /*Get the right month number*/
  private getMonthNumber(str: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(str);
  }
}

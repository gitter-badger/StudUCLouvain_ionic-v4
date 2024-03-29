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
import { ActivatedRoute, Router } from '@angular/router';

import { NewsItem } from '../../../entity/newsItem';

@Component({
  selector: 'page-news-details',
  templateUrl: 'news-details.html',
  styleUrls: ['./news-details.scss'],
})

export class NewsDetailsPage {
  news: NewsItem;

  constructor(private route: ActivatedRoute, private router: Router) {
      this.route.queryParams.subscribe(() => {

      if (this.router.getCurrentNavigation().extras.state) {
        this.news = this.router.getCurrentNavigation().extras.state.items;
      }
    });

  }

  /*Open the url for a news to see more details*/
  public openPage(url: string) {
    window.open(url, '_blank');
  }
}

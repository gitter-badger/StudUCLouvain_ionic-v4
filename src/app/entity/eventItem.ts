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

export class EventItem {
  description: string;
  link: string;
  title: string;
  image: string;
  trimmedDescription: string;
  location: string;
  hidden: boolean;
  favorite: boolean;
  guid: string;
  startDate: Date;
  endDate: Date;
  category: any;
  iconCategory: string;

  constructor(
    description: string,
    link: string,
    title: string,
    image: string,
    trimmedDescription: string,
    location: string,
    hidden: boolean,
    favorite: boolean,
    guid: string,
    startDate: Date,
    endDate: Date,
    category: any,
    iconCategory: string
  ) {
    this.description = description;
    this.link = link;
    this.title = title;
    this.image = image;
    this.trimmedDescription = trimmedDescription;
    this.location = location;
    this.hidden = hidden;
    this.favorite = favorite;
    this.guid = guid;
    this.startDate = startDate;
    this.endDate = endDate;
    this.category = category;
    this.iconCategory = iconCategory;
  }
}

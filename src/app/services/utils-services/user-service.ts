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
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root' 
})
export class UserService {

  favorites: string[] = [];
  campus: string = '';
  slots: Array<{ course: string, TP: string, CM: string }> = [];
  fac: string = '';

  constructor(
    public eventss: Events,
    public storage: Storage
  ) {
    // USE THIS LINE TO CLEAR THE STORAGE
    // storage.clear();
    this.getFavorites();
    this.getCampus();
    this.getSlots();
    this.getFac();
  }

  getFavorites() {
    this.storage.get('listFavorites').then((data) =>
    {
      if(data == null) {
        this.favorites = [];
      } else {
        this.favorites=data;
        }
    });
  }

  getCampus(){
    this.storage.get('campus').then((data) =>
    {
      if(data == null) {
        this.campus = '';
      } else {
        this.campus = data;
        }
    });
  }

  getFac(){
    this.storage.get('fac').then((data) =>
    {
      if(data == null) {
        this.fac = '';
      } else {
        this.fac=data;
        }
    });
  }

  getSlots() {
    this.storage.get('slots').then((data) =>
    {
      if(data == null){
        this.slots = [];
      }
      else{
        this.slots = data;
      }
    });
  }

  getSlot(acronym: string, type: string) {
    const index = this.slots.findIndex(item => item.course === acronym);
    if (index  > -1) {
      const elem = this.slots[index];
      if (type === 'TP') {
        return elem.TP;
      } else {
        return elem.CM;
      }
    } else {
      return '';
    }
  }

  hasFavorite(itemGuid: string) {
    return (this.favorites.indexOf(itemGuid) > -1);
  }

  hasCampus() {
    return(this.campus.length > 0);
  }

  hasFac() {
    return(this.fac.length > 0);
  }

  hasSlot(acronym: string, type: string) {
    let index = this.slots.findIndex(item => item.course === acronym);
    if(index > -1) {
      const elem = this.slots[index];
      if (type === 'TP') {
        return elem.TP.length > 0;
      } else {
        return elem.CM.length > 0;
      }
    } else { 
      return index > -1;
    }

  }

  addFavorite(itemGuid: string) {
    this.favorites.push(itemGuid);
    this.storage.set('listFavorites',this.favorites);
  }

  addCampus(campus: string) {
    this.campus = campus;
    this.storage.set('campus',this.campus);
  }


  addFac(fac: string) {
    this.fac = fac;
    this.storage.set('fac',this.fac);
  };

  removeFavorite(itemGuid: string) {
    let index = this.favorites.indexOf(itemGuid);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
    this.storage.set('listFavorites',this.favorites);
  };

  removeCampus() {
    this.campus = '';
    this.storage.set('campus',this.campus);
  };
  removeFac() {
    this.fac = '';
    this.storage.set('fac',this.fac);
  };
  removeSlotTP(acronym: string) {
    this.removeSlot(acronym, 'TP');
  }

  removeSlotCM(acronym: string) {
    this.removeSlot(acronym, 'CM');
}

removeSlot(acronym: string, type: string){
  let index = this.slots.findIndex(item => item.course === acronym);
  if (index > -1) {
    this.slots[index][type] = '';
  }
  this.storage.set('slots',this.slots);
}

  addSlot(acronym: string, slot: string, type: string) {
    const index = this.slots.findIndex(item => item.course === acronym);
    if (index > -1) {
      if (type === 'TP') {
        this.slots[index].TP = slot;
      } else {
        this.slots[index].CM = slot;
      }
    }
    else {
      this.pushItem(type, acronym, slot);
    }
    this.storage.set('slots',this.slots);
  }

  private pushItem(type: string, acronym: string, slot: string) {
    let item;
    if (type === 'TP') {
      item = { course: acronym, TP: slot, CM: '' };
    }
    else {
      item = { course: acronym, TP: '', CM: slot };
    }
    this.slots.push(item);
  }
}

/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire and Corentin Lamy
    Date : July 2017
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
import { NavController, NavParams, ModalController }
        from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { StudiesService} from '../../../services/studies-services/studies-service';

import { AdeProject } from '../../../entity/adeProject';

@Component({
  selector: 'page-modal-project',
  templateUrl: 'modal-project.html',
})
export class ModalProjectPage {
  sessionId : string;
  public projects;

  constructor(public navCtrl: NavController,
    public storage:Storage,
    public navParams: NavParams,
    public viewCtrl: ModalController,
    public studiesService : StudiesService)
  {
    this.sessionId = this.navParams.get('sessionId');
  }

  /*Set the project and close de view of the modal*/
  closeModal(project : AdeProject) {
    this.studiesService.setProject(this.sessionId, project.id).then(
      data => {
        this.storage.set('adeProject',project);
        this.viewCtrl.dismiss(project);
      }
    )
  }

  /*Get the available projects*/
  getProjects(sessionId :string){
    this.studiesService.getProjects(sessionId).then(
      data => {
        this.projects = data;
    });
  }
  
  ngOnInit() {
    this.getProjects(this.sessionId);
  }

}

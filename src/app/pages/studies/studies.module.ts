import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ModalProjectPageModule } from './modal-project/modal-project.module';
import { StudiesPage } from './studies';
import { StudentService } from '../../services/wso2-services/student-service';
import { StudiesService } from '../../services/studies-services/studies-service';
import { ConnectivityService } from '../../services/utils-services/connectivity-service';
import { TransService } from '../../services/utils-services/trans-services';
import { StudiesRoutingModule } from './studies-routing.module';
import { CoursePage } from './course/course';

@NgModule({
  declarations: [StudiesPage, CoursePage],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalProjectPageModule,
    TranslateModule.forChild(),
    StudiesRoutingModule
  ],
  providers: [
    StudentService,
    StudiesService,
    ConnectivityService,
    TransService,
  ]
})
export class StudiesPageModule { }

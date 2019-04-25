import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { EmployeeDetailsPage } from './employee-details';

@NgModule({
  declarations: [EmployeeDetailsPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class EmployeeDetailsPageModule { }
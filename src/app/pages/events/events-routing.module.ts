import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsPage } from './events';
import { EventsDetailsPage } from './events-details/events-details';

const routes: Routes = [
    {path: '', component: EventsPage},
    {path: 'details', component: EventsDetailsPage},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class EventsRoutingModule {
}
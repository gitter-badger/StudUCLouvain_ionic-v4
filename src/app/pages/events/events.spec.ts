import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { spyFunctionWithCallBackThen } from 'src/app/app.component.spec';
import { EventItem } from 'src/app/entity/eventItem';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Calendar } from '@ionic-native/calendar/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Network } from '@ionic-native/network/ngx';
import { IonicModule, IonItemSliding, ModalController } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';

import {
    MockCacheStorageService, StorageMock
} from '../../../../test-config/MockCacheStorageService';
import {
    AppAvailabilityMock, CalendarMock, DeviceMock, InAppBrowserMock, MarketMock,
    ModalControllerMock, NetworkMock
} from '../../../../test-config/MockIonicNative';
/*
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
import { EventsPage } from './events';

describe('Events Component', () => {
    let fixture;
    let component;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EventsPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                IonicModule.forRoot(),
                TranslateModule.forRoot(),
                IonicStorageModule.forRoot(),
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [
                { provide: ModalController, useClass: ModalControllerMock },
                { provide: Device, useClass: DeviceMock },
                { provide: Market, useClass: MarketMock },
                { provide: AppAvailability, useClass: AppAvailabilityMock },
                { provide: InAppBrowser, useClass: InAppBrowserMock },
                { provide: CacheService, useClass: StorageMock },
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                },
                { provide: Network, useClass: NetworkMock },
                Diagnostic,
                { provide: Calendar, useClass: CalendarMock },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EventsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
        expect(component instanceof EventsPage).toBeTruthy();
    });

    describe('goToEventDetail method', () => {
        it('should call goToDetail of UtilsService', () => {
            const spyGoDetail = spyOn(component.utilsServices, 'goToDetail').and.callThrough();
            spyOn(component.cache, 'saveItem').and.callThrough();
            spyOn(component.cache, 'getItem').and.callThrough();
            const eventItem = new EventItem(
                'description',
                'link',
                'title',
                'image',
                'trimmedD',
                'location',
                false,
                false,
                'guid',
                (d => new Date(d.setDate(d.getDate() - 1)))(new Date),
                (d => new Date(d.setDate(d.getDate() + 1)))(new Date),
                'cat',
                'iconCat'
            );
            component.goToEventDetail(eventItem);
            expect(spyGoDetail.calls.count()).toEqual(1);
            expect(spyGoDetail.calls.first().args[0]).toEqual(eventItem);
            expect(spyGoDetail.calls.first().args[1]).toEqual('events/details');
        });
    });

    describe('removeFavorite method', () => {
        it('should call removeFavorite from UtilsService and then, updateDisplayed', async () => {
            const spyRemove = spyFunctionWithCallBackThen( // TODO: not function with then. async method, have to spy on await call
                component.utilsServices,
                'removeFavorite',
                {}
            );
            const spyUpdate = spyOn(component, 'updateDisplayed').and.callThrough();
            await component.removeFavorite();
            expect(spyRemove.calls.count()).toEqual(1);
            expect(spyUpdate.calls.count()).toEqual(1);
        });
    });

    describe('changeArray method', () => {
        it('should call getItemDisplay from UtilsServices', () => {
            const spyGetItemD = spyOn(component.utilsServices, 'getItemDisplay').and.returnValue('').and.callThrough();
            component.changeArray([{ startDate: new Date() }]);
            expect(spyGetItemD.calls.count()).toEqual(1);
        });
    });

    describe('getWeek method', () => {
        it('should return the week number', () => {
            // NUUL => A AMELIORER
            const temp = new Date(new Date().getFullYear(), 0, 4);
            expect(component.getWeek(new Date())).toEqual(
                1 + Math.round(((new Date().getTime() - temp.getTime()) / 86400000 - 3 + (temp.getDay() + 6) % 7) / 7)
            );
        });
    });

    describe('addFavorite method', () => {
        it('should call addFavorite from UtilsService', () => {
            const spyAdd = spyOn(component.utilsServices, 'addFavorite').and.callThrough();
            component.addFavorite();
            expect(spyAdd.calls.count()).toEqual(1);
        });
    });

    describe('doRefresh method', () => {
        it('should call doRefresh from UtilsService', () => {
            const spyRefresh = spyOn(component.utilsServices, 'doRefresh').and.callThrough();
            spyOn(component.utilsServices.cache, 'removeItem').and.returnValue(
                new Promise((resolve, reject) => { })
            );
            component.doRefresh({ target: { complete: () => { return; } } });
            expect(spyRefresh.calls.count()).toEqual(1);
        });
    });

    describe('onSearchInput method', () => {
        it('should set searching on TRUE', () => {
            component.onSearchInput();
            expect(component.searching).toBeTruthy();
        });
    });

    describe('tabChanged method', () => {
        it('should call cachedOrNot if all segment', () => {
            const spyCachedOrNot = spyOn(component, 'cachedOrNot').and.callThrough();
            component.tabChanged({ 'detail': { 'value': 'all' } });
            expect(spyCachedOrNot.calls.count()).toEqual(1);
        });

        it('should call updateDisplayed if favorites segment', () => {
            const spyUpdate = spyOn(component, 'updateDisplayed').and.callThrough();
            component.tabChanged({ 'detail': { 'value': 'favorites' } });
            expect(spyUpdate.calls.count()).toEqual(1);
        });
    });

    describe('cachedOrNot method', () => {
        it('should call getItem from Cache and present loader during update the displayed events', async () => {
            const spyGetItem = spyFunctionWithCallBackThen(
                component.cache,
                'getItem',
                { items: [{ startDate: new Date(), endDate: new Date() }] }
            );
            const spyLoad = spyFunctionWithCallBackThen( // TODO: not function with then. async method, have to spy on await call
                component.loader,
                'present',
                {}
            );
            const spyUpdate = spyOn(component, 'updateDisplayed').and.callThrough();

            await component.cachedOrNot();

            expect(spyGetItem.calls.count()).toEqual(1);
            expect(spyGetItem.calls.first().args[0]).toEqual('cache-event');
            expect(spyLoad.calls.count()).toEqual(1);
            expect(spyUpdate.calls.count()).toEqual(1);
            expect(component.searching).toBeTruthy();
        });
        it('should call loadEvents on reject', async () => {
            // TOFIX: TO TEST
            const spyReject = spyOn(component.cache, 'getItem').and.returnValue(Promise.reject('ERROR'));
            await component.cachedOrNot();
            expect(spyReject.calls.count()).toEqual(1);
        });
    });

    describe('loadEvents method', () => {
        it('should call getEvents from EventService and updateDisplayed', async () => {
            const spyGetEvents = spyFunctionWithCallBackThen(component.eventsService, 'getEvents', { items: [] });
            const spySave = spyOn(component.cache, 'saveItem').and.callThrough();
            const spyUpdate = spyOn(component, 'updateDisplayed').and.callThrough();
            await component.loadEvents('key');
            expect(spyGetEvents.calls.count()).toEqual(1);
            expect(spyUpdate.calls.count()).toEqual(1);
            expect(component.searching).toBeFalsy();
            expect(spySave.calls.count()).toEqual(1);
            expect(spySave.calls.first().args[0]).toEqual('key');
        });
    });

    describe('presentFilter method', () => {
        it('should call create from ModalController', () => {
            component.presentFilter();
            const create = component.modalCtrl.create;
            expect(create.calls.count()).toEqual(1);
        });
    });

    describe('toggleGroup method', () => {
        it('should call toggleGroup from UtilsService', () => {
            const spyToggle = spyOn(component.utilsServices, 'toggleGroup').and.callThrough();
            component.toggleGroup('');
            expect(spyToggle.calls.count()).toEqual(1);
        });
    });

    describe('createEvent method', () => {
        it('should call createEventInCalendar from utilsServices', () => {
            const spyCreate = spyOn(component.utilsServices, 'createEventInCalendar').and.callThrough();
            let ionItemSliding: IonItemSliding;
            const data = {
                title: 'title',
                location: 'location',
                start: 'start',
                end: 'end'
            };
            component.createEvent(
                ionItemSliding,
                {
                    title: 'title',
                    location: 'location',
                    startDate: 'start',
                    endDate: 'end'
                }
            );
            expect(spyCreate.calls.count()).toEqual(1);
            expect(spyCreate.calls.first().args[0]).toEqual(data);
            expect(spyCreate.calls.first().args[2]).toEqual(ionItemSliding);
        });
    });

    describe('getRangeWeek method', () => {
        it('should call getFullDate', () => {
            const spyGetFullDate = spyOn(component, 'getFullDate').and.callThrough();
            component.getRangeWeek(25, 2019);
            expect(spyGetFullDate.calls.count()).toEqual(2);
        });
    });
});

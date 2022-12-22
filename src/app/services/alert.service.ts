import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { appConfig } from '../config/appconfig';
import { Utilities } from './utility.service';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    alertHandler = new Subject<any>();
    constructor(private util: Utilities) {

    }

    showAlert(msg) {
        this.alertHandler.next({ show: true, msg: this.util.camelize(msg) });
    }
    hideAlert(msg) {
        this.alertHandler.next({ show: false, msg: null });
    }
}
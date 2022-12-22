import { Injectable } from '@angular/core';
import { appConfig } from '../config/appconfig';

@Injectable({
    providedIn: 'root'
})
export class LsmanagerService {

    private lsObj: any;
    constructor() {

    }
    getDataFromlocalStorage(key): any {
        if (appConfig.lskey in localStorage) {
            let localData = JSON.parse(localStorage[appConfig.lskey]);
            if (key in localData)
                return localData[key];
            return null;
        }
        return null;
    }
    setToLocalStorage(key, value) {
        if (!(appConfig.lskey in localStorage))
            localStorage[appConfig.lskey] = "{}";
        let lsData = JSON.parse(localStorage[appConfig.lskey])
        lsData[key] = value;
        localStorage[appConfig.lskey] = JSON.stringify(lsData);
    }
}
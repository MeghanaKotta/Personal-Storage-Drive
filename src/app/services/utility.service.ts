import { Injectable } from '@angular/core';
import { appConfig } from '../config/appconfig';

@Injectable({
    providedIn: 'root'
})
export class Utilities {

    constructor() {

    }

    isStringBlank(data: String) {
        if(!data || data.trim().length == 0)
        return true;
        return false;
    }
    isStringNotBlank(data: String) {
        if (data && data.trim().length > 0)
            return true;
        return false;
    }

    camelize(str) {

        let arr = str.split(" ");
        let finalArr = [];
        arr.forEach(element => {
            finalArr.push(element.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
                return index == 0 ? word.toUpperCase() : word.toLowerCase();
            }).replace(/\s+/g, ''));
        });
        return finalArr.join(" ");
    }
}
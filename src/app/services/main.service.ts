import { Injectable } from '@angular/core';
import { LsmanagerService } from './lsmanager.service';
import { appConfig } from '../config/appconfig';
import { UserData } from '../models/UserData';
@Injectable({
    providedIn: 'root'
})
export class MainService {

    constructor(private lsMngr: LsmanagerService) {

    }



    addAUserDataField(userData: UserData): Boolean {
        let title = userData.title;
        if (title && title.trim().length > 0) {
            // check if already title is there
            if (!this.isTitleAlreadyExistsInUserData(title)) {
                let userDataList: Array<UserData> =
                    this.lsMngr.getDataFromlocalStorage(appConfig.userDataLsKey);
                if (!userDataList) {
                    userDataList = new Array<UserData>();
                }
                userData.title = userData.title.toUpperCase();
                userData.index = userDataList.length;
                userDataList.push(userData);
                this.lsMngr.setToLocalStorage(appConfig.userDataLsKey, userDataList);
                return true;
            }
        }
        return false;
    }

    isTitleAlreadyExistsInUserData(title: String): Boolean {
        let userDataList: Array<UserData> =
            this.lsMngr.getDataFromlocalStorage(appConfig.userDataLsKey);
        if (userDataList) {
            for (var i = 0; i < userDataList.length; i++) {
                if (userDataList[i].title.trim() == title.toUpperCase())
                    return true;
            }
        }
        return false;
    }

    rearrangeIndexes(userDataList) {
        if (userDataList) {
            for (var i = 0; i < userDataList.length; i++) {
                userDataList[i].index = i;
            }
        }
    }

    saveUserDataList(userDataList: UserData[]) {
        this.lsMngr.setToLocalStorage(appConfig.userDataLsKey, userDataList);
    }

    mailUserData(emailId) {
        var storageObj = this.lsMngr.getDataFromlocalStorage(appConfig.userDataLsKey);
        var link = "mailto:" + emailId + "?"
            + "&subject=" + encodeURIComponent("This is my subject")
            + "&body=" + encodeURIComponent(JSON.stringify(storageObj))
            ;
        window.location.href = link;
    }


}
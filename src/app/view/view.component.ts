import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { appConfig } from '../config/appconfig';
import { TableHeaderConfig } from '../config/tableHeaderConfig';
import { UserData } from '../models/UserData';
import { AlertService } from '../services/alert.service';
import { LsmanagerService } from '../services/lsmanager.service';
import { Utilities } from '../services/utility.service';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {


  constructor(private lsManagerService: LsmanagerService, private mainServc: MainService, private alertService: AlertService, private util: Utilities) {
    this.generateUserDataList();
    this.generateFilteredUserDataList();
  }

  public userDataList: UserData[] = new Array<UserData>();
  public filteredUserDataList: UserData[] = new Array<UserData>();
  tableHeaderConfig: any = TableHeaderConfig.viewTableTableHeaderConfig;
  ngOnInit(): void {
  }

  generateUserDataList() {
    this.userDataList = this.lsManagerService.getDataFromlocalStorage(appConfig.userDataLsKey);
    if (!this.userDataList) {
      this.userDataList = new Array<UserData>();
    }
  }

  generateFilteredUserDataList() {
    this.filteredUserDataList = this.lsManagerService.getDataFromlocalStorage(appConfig.userDataLsKey);
    if (!this.filteredUserDataList) {
      this.filteredUserDataList = new Array<UserData>();
    }
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.alertService.showAlert("Copied to clipboard");
  }

  filterUserDataList() {
    let titleFilterText = ((<HTMLInputElement>document.getElementById("TITLE")).value).toUpperCase();
    let valueFilterText = (<HTMLInputElement>document.getElementById("VALUE")).value;
    if (this.util.isStringBlank(titleFilterText) && this.util.isStringBlank(valueFilterText)) {
      this.filteredUserDataList = [...this.userDataList];
    }
    else {
      let considerTitle = this.util.isStringNotBlank(titleFilterText);
      let considerValue = this.util.isStringNotBlank(valueFilterText);
      let finalFilteredList = new Array<UserData>();
      this.filteredUserDataList = this.userDataList.filter((usd) => {
        if (considerTitle && !considerValue) {
          return usd.title.includes(titleFilterText);
        }
        else if (considerValue && !considerTitle) {
          return usd.value.toLowerCase().includes(valueFilterText.toLowerCase());
        }
        else {
          return  usd.title.includes(titleFilterText) && usd.value.toLowerCase().includes(valueFilterText.toLowerCase());
        }
      });
    }
  }

  deleteUserData(index) {

    let finalData = new Array<UserData>();
    if (this.userDataList) {
      for (var i = 0; i < this.userDataList.length; i++) {
        if (index != i) {
          finalData.push(this.userDataList[i]);
        }
      }
    }
    this.mainServc.rearrangeIndexes(finalData);
    this.mainServc.saveUserDataList(finalData);
    this.reInitPage();

  }
  reInitPage()
  {
    this.generateUserDataList();
    this.generateFilteredUserDataList();
  }
}

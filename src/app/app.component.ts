import { Component } from '@angular/core';
import { appConfig } from './config/appconfig';
import { navbarData } from './config/navconfig';
import { UserData } from './models/UserData';
import { AlertService } from './services/alert.service';
import { LsmanagerService } from './services/lsmanager.service';
import { Utilities } from './services/utility.service';
import { MainService } from './services/main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'storedata';
  navConfigData = navbarData;
  showAlert: boolean = false;
  msg: any = null;

  constructor(private altServc: AlertService, private lsmanager: LsmanagerService,
    private util: Utilities, private mailServc: MainService) {
    this.altServc.alertHandler.subscribe((data) => {
      if (data) {
        if (data.show) {
          this.displayAlert(data.msg);
        }
        else {
          this.hideAlert();
        }
      }
    })
  }

  displayAlert(message) {
    if (!this.showAlert) {
      this.msg = message;
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, appConfig.alertDisplayTime)
    }
  }
  hideAlert() {
    this.showAlert = false;
    this.msg = null;
  }

  downloadUserData() {
    var storageObj = this.lsmanager.getDataFromlocalStorage(appConfig.userDataLsKey);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "data.json");
    dlAnchorElem.click();
  }
  sendMail() {
    let userDataList: UserData[] = this.lsmanager.getDataFromlocalStorage(appConfig.userDataLsKey);
    let autoPickedEmailId: any = "";
    if (userDataList) {
      for (var i = 0; i < userDataList.length; i++) {
        if (userDataList[i].title.includes("EMAIL") && this.util.isStringNotBlank(userDataList[i].value)) {
          autoPickedEmailId = userDataList[i].value;
          break;
        }
      }
    }
    var emailId = prompt("Please enter EMAIL ", autoPickedEmailId);
    if (this.util.isStringBlank(emailId)) {
      this.displayAlert("NO PROPER EMAIL ID GIVEN")
    }
    else {
      this.mailServc.mailUserData(emailId);
    }
  }

  onFileChanged(event) {
    let selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF-8");
    fileReader.onload = () => {
      console.log(fileReader.result);
      let res: any = fileReader.result;
      try {
        const userDataList = JSON.parse(res);
        const confirmCheck = window.confirm("EXISTING DATA WILL BE LOST, DO YOU WANT TO CONTINUE?");
        if (confirmCheck) {
          this.mailServc.saveUserDataList(userDataList);
        }

      } catch (error) {
        this.displayAlert("NOT PROPER DATA")
      }
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { UserData } from '../models/UserData';
import { AlertService } from '../services/alert.service';
import { MainService } from '../services/main.service';
import { Utilities } from '../services/utility.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(private mainService: MainService, private util: Utilities, private alertServc: AlertService) { }
  userData: UserData = new UserData();
  ngOnInit(): void {
  }
  save() {
    if (this.userData && this.util.isStringNotBlank(this.userData.title) && this.util.isStringNotBlank(this.userData.value)) {
      let status = this.mainService.addAUserDataField(this.userData);
      if (status) {
        this.alertServc.showAlert("SAVE SUCCESS");
        this.userData= new UserData();
      }
      else {
        this.alertServc.showAlert("CHECK Data");
      }
    }
    else {
      this.alertServc.showAlert("WRONG DATA GIVEN");
    }
  }

}

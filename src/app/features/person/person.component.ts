import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'src/app/core/services/master.service';
import { API_ENDPOINT } from 'src/app/shared/constants/api-endpoint.const';
import { NOTIFICATION } from 'src/app/shared/constants/notification.const';
import { Person } from 'src/app/shared/models/person.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'web-app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent implements OnInit {
  person: Person = { Name: '' };
  persons: Person[] = [];
  name: string = '';
  saveEnabled = false;
  constructor(
    private apiService: MasterService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  savePerson() {
    if (this.name) {
      this.person.Name = this.name;
      this.apiService
        .post(environment.baseUrl + API_ENDPOINT.PERSON, this.person)
        .subscribe(
          (data) => {
            this.name = '';
            this.saveEnabled = false;
            this._snackBar.open(
              NOTIFICATION.PERSON_SAVE_SUCCESS,
              NOTIFICATION.SUCCESS,
              {
                duration: 5 * 1000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );
          },
          (err) => {
            this._snackBar.open(
              NOTIFICATION.PERSON_SAVE_FAILURE,
              NOTIFICATION.FAILURE,
              {
                duration: 5 * 1000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );
          }
        );
    } else {
      this.saveEnabled = false;
    }
  }

  checkValue() {
    if (this.name) {
      this.saveEnabled = true;
    }
  }
}

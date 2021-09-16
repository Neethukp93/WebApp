import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'src/app/core/services/master.service';
import { API_ENDPOINT } from 'src/app/shared/constants/api-endpoint.const';
import { NOTIFICATION } from 'src/app/shared/constants/notification.const';
import { Company } from 'src/app/shared/models/company.model';
import { Person } from 'src/app/shared/models/person.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'web-app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  companyPersons: Person[] = [];
  companies: Company[] = [];
  persons: Person[] = [];
  company: Company = { Name: '' };
  name: string = '';
  saveEnabled = false;
  constructor(
    private apiService: MasterService,
    private utility: UtilityService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.apiService
      .get(environment.baseUrl + API_ENDPOINT.COMPANY)
      .subscribe((data: any) => {
        this.companies = this.utility.parseArray(data);
      });

    this.apiService
      .get(environment.baseUrl + API_ENDPOINT.PERSON)
      .subscribe((data: any) => {
        this.persons = this.utility.parseArray(data);
      });
  }

  saveCompany() {
    if (this.company) {
      this.company.Name = this.name;
      this.apiService
        .post(environment.baseUrl + API_ENDPOINT.COMPANY, this.company)
        .subscribe((data: any) => {
          this.name = '';
          this.saveEnabled = false;
          this.companies.push({ Name: this.company.Name, Id: data.name });
          this._snackBar.open(
            NOTIFICATION.COMPANY_SAVE_SUCCESS,
            NOTIFICATION.SUCCESS,
            {
              duration: 5 * 1000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        });
    } else {
      this.saveEnabled = false;
    }
  }

  checkValue() {
    if (this.name) {
      this.saveEnabled = true;
    }
  }

  remove(person: Person): void {
    const index = this.companyPersons.indexOf(person);

    if (index >= 0) {
      this.companyPersons.splice(index, 1);
      let actualIndex = this.persons.indexOf(person);
      delete this.persons[actualIndex].Company;
      delete this.persons[actualIndex].CompanyId;
      const parsedObj = this.utility.parseObj(this.persons);
      this.apiService
        .put(environment.baseUrl + API_ENDPOINT.PERSON, parsedObj)
        .subscribe((data) => {
          this._snackBar.open(
            NOTIFICATION.REMOVE_PERSON_SUCCESS,
            NOTIFICATION.SUCCESS,
            {
              duration: 5 * 1000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        });
    }
  }

  onCompanySelect(event) {
    this.companyPersons = this.persons.filter(
      (person) => person.CompanyId === event.value
    );

    if (this.companyPersons.length === 0) {
      this._snackBar.open('No Persons Found', '', {
        duration: 3 * 1000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
}

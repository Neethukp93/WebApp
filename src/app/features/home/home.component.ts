import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable } from 'rxjs';
import { MasterService } from 'src/app/core/services/master.service';
import { API_ENDPOINT } from 'src/app/shared/constants/api-endpoint.const';
import { NOTIFICATION } from 'src/app/shared/constants/notification.const';
import { Company } from 'src/app/shared/models/company.model';
import { Person } from 'src/app/shared/models/person.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'web-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Name', 'CompanyId'];
  dataSource = new MatTableDataSource<Person>([]);
  myControl = new FormControl();
  companies: Company[] = [];
  filteredOptions: Observable<string[]>;
  persons: Person[] = [];
  filteredPersons: Person[] = [];
  isDisabled = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private apiService: MasterService,
    private utility: UtilityService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const companyListApi = this.apiService.get(
      environment.baseUrl + API_ENDPOINT.COMPANY
    );

    const personsApi = this.apiService.get(
      environment.baseUrl + API_ENDPOINT.PERSON
    );

    forkJoin([companyListApi, personsApi]).subscribe((data: any) => {
      const [companyResp, personsResp] = data;
      this.companies = this.utility.parseArray(companyResp);
      this.persons = this.utility.parseArray(personsResp);
      this.filteredPersons = this.findPersonsWithoutcompany(this.persons);
      this.dataSource = new MatTableDataSource(this.filteredPersons);
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  _filter(value: string): Company[] {
    return (
      value &&
      this.companies.filter((option) =>
        option.Name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  findPersonsWithoutcompany(persons: Person[]) {
    return persons.filter((person) => person.Company === undefined);
  }

  bindCompany(company: any, index: number) {
    this.filteredPersons[index].CompanyId = company.Id;
    this.isDisabled = false;
  }

  saveTable() {
    const parsedObj = this.utility.parseObj(this.persons);
    this.apiService
      .put(environment.baseUrl + API_ENDPOINT.PERSON, parsedObj)
      .subscribe((data) => {
        this.isDisabled = true;
        this.filteredPersons = this.findPersonsWithoutcompany(this.persons);
        this.dataSource = new MatTableDataSource(this.filteredPersons);
        this._snackBar.open(
          NOTIFICATION.ASSIGN_COMPANY_SUCCESS,
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

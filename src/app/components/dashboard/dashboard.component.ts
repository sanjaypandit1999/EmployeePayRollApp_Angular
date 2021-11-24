import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  employeepayrollList: any;
  employeeCount: number = 10;

  constructor(public dialog: MatDialog, private httpuserservice: HttpService) { }


  /**
   * All employee details is populated from the localstorage to the HOME page.
   */
  ngOnInit(): void {
    this.employeepayrollList = localStorage.getItem('EmployeePayrollList') ?
      JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    this.employeeCount = this.employeepayrollList.length;

  }

  /**
  * When the remove() is hit, the employee gets deleted from the localstorage and also the details is removed from the HOME page.
  * Thus, a refreshed home page is rendered and a remove message is displayed to the user.
  * 
  * @param i remove() is invoked for a particular employee index.
  */
  remove(i: number) {
    console.log(i);
    console.log(this.employeepayrollList);
    if (this.employeepayrollList !== null) {
      const empList = this.employeepayrollList;
      empList.splice(i, 1);
      localStorage.setItem('EmployeePayrollList', JSON.stringify(empList));
      this.employeeCount = this.employeepayrollList.length;
    }
    this.ngOnInit();
  }


  /**
   * When the update() is hit, data of a particular index is populate in home page.
   * The page gets navigated to the add page along with the employee object in the body.
   * 
   * @param i update() is invoked for a particular employee index.
   */
  update(i: number) {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      data: i
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit();
    })
  }

}

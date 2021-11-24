import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
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

  constructor(public dialog: MatDialog,  private httpuserservice: HttpService) { }

  ngOnInit(): void {
    this.httpuserservice.getRequest('').sub
  this.employeepayrollList =localStorage.getItem('EmployeePayrollList') ?
  JSON.parse(localStorage.getItem('EmployeePayrollList')) : [] ;
  this.employeeCount=this.employeepayrollList.length;

  }

remove(i: number) {
  console.log(i);
  console.log( this.employeepayrollList);
  if (this.employeepayrollList!== null) { 
    const empList = this.employeepayrollList;
    empList.splice(i,1);
    localStorage.setItem('EmployeePayrollList', JSON.stringify(empList));
    this.employeeCount=this.employeepayrollList.length;
  }
   this.ngOnInit();
}
  update(i: number) {
    const dialogRef = this.dialog.open(AddEmployeeComponent,{
      data: i
    });
    dialogRef.afterClosed().subscribe(result=>{
      console.log(result);
      this.ngOnInit();
    })
  }

}

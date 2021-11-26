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

  constructor(public dialog: MatDialog, private httpuserservice: HttpService) {
    this.ngOnInit();
   }


  /**
   * All employee details is populated from the localstorage to the HOME page.
   */
  ngOnInit(): void {
    this.httpuserservice.getRequest('/employeepayrollservice/get').subscribe(response=>{
  //    console.log(response.data)
      this.employeepayrollList=response.data;
      this.employeeCount=this.employeepayrollList.length; 
    })
  }

  /**
  * When the remove() is hit, the employee gets deleted from the localstorage and also the details is removed from the HOME page.
  * Thus, a refreshed home page is rendered and a remove message is displayed to the user.
  * 
  * @param i remove() is invoked for a particular employee index.
  */
  remove(id: number) {
    debugger;
    console.log(id);
    this.httpuserservice.deleteRequest('/employeepayrollservice/delete/'+id).subscribe(data=> {
      console.log(data);
      alert("Employee is deleted")
      this.ngOnInit();      
    });
  }


  /**
   * When the update() is hit, data of a particular index is populate in home page.
   * The page gets navigated to the add page along with the employee object in the body.
   * 
   * @param i update() is invoked for a particular employee index.
   */
  update(employee) {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      data: employee
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      alert("Updated Successfull")
      this.ngOnInit();
    })
  }

}

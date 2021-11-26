import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

const httpOptions: any = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'all',
    'Access-Control-Allow-Origin': '*'
  })
};

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeFormGroup: FormGroup;
  tokenList: any;

  departments: Array<any> = [
    {
      name: "HR",
      value: "HR"
    },
    {
      name: "Sales",
      value: "Sales"
    },
    {
      name: "Finance",
      value: "Finance"
    },
    {
      name: "Engineer",
      value: "Engineer"
    },
    {
      name: "Other",
      value: "Other"
    },
  ]

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddEmployeeComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private httpuserservice: HttpService,
    private router: Router) {

    /**
     * Added validations to the employee payroll form data.
     */
    this.employeeFormGroup = this.formBuilder.group({
      empName: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][a-zA-z\\s]{2,}$")]),
      profilePic: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      salary: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required),
    });
  }

  /**
   * Method to capture the salary value from the slider.
   * The value in the formatLabel() is set at an interval of 1000.
   * The event variable basically provides the value of the slider (to which value it is moved to)
   * and it is stored in the salaryOutput.
   */
  salaryOutput: number = 40000;
  updateSetting(event) {
    this.salaryOutput = event.value;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 10000) + 'k';
    }
    return value;
  }
  /**
   * Method to set the employee object value of a particular employee id in the Employee FormBuilder.
   * This method is called when the update() is hit in the HOME page.
   */
  ngOnInit(): void {
    debugger;
    console.log(this.data);
    if(this.data!=null){
      this.employeeFormGroup.patchValue({
        empName: this.data.name,
        profilePic: this.data.profilePic,
        gender: this.data.gender,
        salary:this.data.salary,
        note: this.data.note
      });
    }
  }

 /**
   * onSubmit() is common for ERROR Validation, PUT and POST HTTP Method.
   * Initially the form is validated whether all data is inputted.
   * The name, date and text box displays error using <mat-error> and the profilePic, gender, department and salary gives a dialog window.
   * If the contains any id, then the PUT method is called; else the POST method is called.
   * Once either of the methods get executed, the respond data is consoled on screen to verify its status.
   * Finally the page gets redirected to the home page and a message is displayed to the user.
   */
  onSubmit() {
    debugger;
    if(this.data.employeeId!= undefined){
      this.httpuserservice.putRequest('/employeepayrollservice/update/'+this.data.employeeId, this.employeeFormGroup.value).subscribe(res=>{
        this.tokenList= res.data;
        localStorage.setItem('tokenList', this.tokenList);
      });
      this.dialogRef.close();
   }
    else{
      this.httpuserservice.postRequest('/employeepayrollservice/create', this.employeeFormGroup.value).subscribe(res=>{
        console.log(res);
        this.tokenList= res.data;
        localStorage.setItem('tokenList', this.tokenList);
        })
    }
    this.router.navigate(['']);

  }

  /**
   * Method to validate empName and note
   * 
   * @param controlName value add in the input tag.
   * @param errorName error value displayed from the mat-error tag.
   * @returns the error value.
   */
  public checkError = (controlName: string, errorName: string) => {
    return this.employeeFormGroup.controls[controlName].hasError(errorName);
  }

}

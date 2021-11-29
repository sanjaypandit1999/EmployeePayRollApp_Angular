import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar/snack-bar';
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
  message: string;

  departments: Array<any> = [
    {
      name: "HR",
      value: "HR",
      checked: false

    },
    {
      name: "Sales",
      value: "Sales",
      checked: false
    },
    {
      name: "Finance",
      value: "Finance",
      checked: false
    },
    {
      name: "Engineer",
      value: "Engineer",
      checked: false
    },
    {
      name: "Other",
      value: "Other",
      checked: false
    },
  ]

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddEmployeeComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private httpuserservice: HttpService,
    private router: Router,) {

    /**
     * Added validations to the employee payroll form data.
     */
    this.employeeFormGroup = this.formBuilder.group({
      empName: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][a-zA-z\\s]{2,}$")]),
      profilePic: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      salary: new FormControl('', Validators.required),
      departments: this.formBuilder.array([], [Validators.required]),
      startDate: new FormControl('', Validators.required),
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

  onCheckboxChange(event: MatCheckboxChange) {
    const department: FormArray = this.employeeFormGroup.get('departments') as FormArray;

    if (event.checked) {
      department.push(new FormControl(event.source.value));
    } else {
      const index = department.controls.findIndex(x => x.value === event.source.value);
      department.removeAt(index);
    }
  }
  /**
   * Method to set the employee object value of a particular employee id in the Employee FormBuilder.
   * This method is called when the update() is hit in the HOME page.
   */
  ngOnInit(): void {
    debugger;
    console.log(this.data);
    if (this.data != null) {
      const department: FormArray = this.employeeFormGroup.get('departments') as FormArray;
      this.employeeFormGroup.patchValue({
        empName: this.data.name,
        profilePic: this.data.profilePic,
        gender: this.data.gender,
        salary: this.data.salary,
        note: this.data.note,
        startDate: this.data.startDate,
      });
      const departments: FormArray = this.employeeFormGroup.get('departments') as FormArray;
      if (this.data.departments)
        this.data.departments.forEach(departmentElements => {
          for (let index = 0; index < this.departments.length; index++) {
            if (this.departments[index].name == departmentElements) {
              this.departments[index].checked = true;
              departments.push(new FormControl(this.departments[index].value));
            }
          }
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
    var dateString = this.employeeFormGroup.get('startDate').value;
    var myDate = new Date(dateString);
    myDate.setDate(myDate.getDate());
    var today = new Date();
    if (myDate > today) {
      this.message = "StartDate should not be future date.";
      alert(this.message);
    } else {
      this.employeeFormGroup.get('startDate')?.setValue(myDate);
    }

    if (this.employeeFormGroup.invalid) {
      if (this.employeeFormGroup.get('departments').value.length == 0) {
        this.message = "Department is empty";
        alert(this.message);
      } else {
        this.message = "1. Profile Pic required \n 2. Gender required \n 3. Min Wage should be more than 10000";
        alert(this.message);
      }
    } else {
      if (this.data.employeeId != undefined) {
        this.httpuserservice.putRequest('/employeepayrollservice/update/' + this.data.employeeId, this.employeeFormGroup.value).subscribe(res => {
          this.tokenList = res.data;
          localStorage.setItem('tokenList', this.tokenList);
          this.message = res.message;
          alert(this.message)
          this.router.navigateByUrl("");
        });
        this.dialogRef.close();
      } else {
        this.httpuserservice.postRequest('/employeepayrollservice/create', this.employeeFormGroup.value).subscribe(res => {
          console.log(res);
          this.tokenList = res.data;
          localStorage.setItem('tokenList', this.tokenList);
          this.message = res.message;
          this.router.navigateByUrl("");
        })
      }
    }

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

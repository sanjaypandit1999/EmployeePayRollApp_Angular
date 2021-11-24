import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeFormGroup: FormGroup;

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
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private httpuserservice: HttpService) {

    /**
     * Added validations to the employee payroll form data.
     */
    this.employeeFormGroup = this.formBuilder.group({
      empName: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][a-zA-z\\s]{2,}$")]),
      profilePic: new FormControl('', Validators.required),
      empGender: new FormControl('', Validators.required),
      department: this.formBuilder.array([], [Validators.required]),
      empSalary: new FormControl('', Validators.required),
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
  /**
    * Method to set the employee object value of a particular id in the Employee FormBuilder.
    * This method is called when the update() is hit in the HOME page.
    */
  ngOnInit(): void {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList[this.data] != null) {
      this.employeeFormGroup.patchValue({
        empName: employeePayrollList[this.data].empName,
        profilePic: employeePayrollList[this.data].profilePic,
        empGender: employeePayrollList[this.data].empGender,
        empSalary: employeePayrollList[this.data].empSalary,
        // startDate:this.data.startDate,
        note: employeePayrollList[this.data].note
      });
    }
  }

  /**
  * onSubmit() is method to store the employeeform object in localStorsge.
  * Initially the form is validated whether all data is inputted.
  * Finally the page gets redirected to the home page and a message is displayed to the user.
  */
  onSubmit() {
    console.log(this.data);
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList[this.data] == null) {

      if (employeePayrollList != undefined) {
        employeePayrollList.push(this.employeeFormGroup.value);
      } else {
        employeePayrollList = [this.employeeFormGroup.value];
      }
      localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
    }
    else {
      employeePayrollList.splice(this.data, 1, this.employeeFormGroup.value);
      localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
      this.dialogRef.close();
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

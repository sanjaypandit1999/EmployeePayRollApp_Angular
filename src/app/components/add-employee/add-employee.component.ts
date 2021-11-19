import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeFormGroup: FormGroup;

  // departments: Array<any> = [
  //   {
  //     name:"HR",
  //     value:"HR", 
  //     checked:false
  //   },
  //   {
  //     name:"Sales",
  //     value:"Sales", 
  //     checked:false
  //   },
  //   {
  //     name:"Finance",
  //     value:"Finance", 
  //     checked:false
  //   },
  //   {
  //     name:"Engineer",
  //     value:"Engineer", 
  //     checked:false
  //   },
  //   {
  //     name:"Other",
  //     value:"Other", 
  //     checked:false
  //   },
  // ]
  
  constructor(private formBuilder: FormBuilder) { 
    this.employeeFormGroup = this.formBuilder.group({
      empName: new FormControl('', [ Validators.required, Validators.pattern("^[A-Z][a-zA-z\\s]{2,}$")]),
      profilePic: new FormControl('', Validators.required),
      empGender: new FormControl('', Validators.required),
      department: this.formBuilder.array([], Validators.required),
      empSalary: new FormControl('', Validators.required),
    //  startDate: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required),
    })
  }
  salaryOutput: number = 400000;
  updateSetting(event) {
    this.salaryOutput = event.value;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.employeeFormGroup)
  }
  
  public checkError = (controlName: string, errorName: string) => {
    return this.employeeFormGroup.controls[controlName].hasError(errorName);
  }

}

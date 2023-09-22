import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee1',
  templateUrl: './employee1.component.html',
  styleUrls: ['./employee1.component.css']
})
export class Employee1Component {

  employees = [
    { id: 1, firstname: 'Mihir', lastname: 'Narkar', contactno: '8373788371', email: 'Mihirnarkar19@gmail.com', dob: '1990-01-01', address: 'Cotton green' },
    { id: 2, firstname: 'Srushti', lastname: 'Pagare', contactno: '9899797991', email: 'srushti@gmail.com', dob: '1995-05-05', address: 'Kandivali' }
  ];

  editIndex: number = -1;
  currentlyEditedEmployee: any = null;
  employeeForm: FormGroup; // Define the form as a FormGroup

  constructor(private fb: FormBuilder) {
    // Initialize the form with validation rules:
    this.employeeForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      contactno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  // Method to check if a form field is touched
  isFieldTouched(field: string): boolean {
    return !!this.employeeForm.get(field)?.touched;
  }
  
  addEmployee() {
    const newEmployee = { id: this.employees.length + 1, firstname: '', lastname: '', contactno: '', email: '', dob: '', address: '' };
    this.employees.push(newEmployee);
    this.editEmployee(this.employees.length - 1, true); // Pass true to indicate a new employee
  }
  

  editEmployee(index: number, isNewEmployee: boolean = false) {
    this.editIndex = index;
    if (isNewEmployee) {
      this.currentlyEditedEmployee = { ...this.employees[index] };
    } else {
      this.currentlyEditedEmployee = { ...this.employees[index] };
    }
  }
  

  saveEmployee(index: number) {
    if (this.currentlyEditedEmployee) {
      this.employees[index] = { ...this.currentlyEditedEmployee }; // Update the employee data
    }
    this.editIndex = -1;
    this.currentlyEditedEmployee = null;
  }

  cancelEdit(index: number) {
    // Revert changes
    this.editIndex = -1;
    this.currentlyEditedEmployee = null;
  }

  deleteEmployee(index: number) {
    this.employees.splice(index, 1);
    this.editIndex = -1;
    this.currentlyEditedEmployee = null;
  }
}

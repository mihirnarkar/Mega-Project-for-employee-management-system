import { Component } from '@angular/core';

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

  addEmployee() {
    const newEmployee = { id: this.employees.length + 1, firstname: '', lastname: '', contactno: '', email: '', dob: '', address: '' };
    this.employees.push(newEmployee);
    this.editEmployee(this.employees.length - 1);
  }

  editEmployee(index: number) {
    this.editIndex = index;
    this.currentlyEditedEmployee = { ...this.employees[index] }; // Create a copy of the employee being edited
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

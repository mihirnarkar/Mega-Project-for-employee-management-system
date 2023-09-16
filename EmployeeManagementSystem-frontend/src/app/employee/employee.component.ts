import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';



// Define an interface for your data structure
interface UserData {
  firstname: string;
  lastname: string;
  dob: string;
  email: string;
  address: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {

  userForm!: FormGroup;

  displayedColumns: string[] = ['firstname', 'lastname', 'dob', 'email', 'action'];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {

    this.userForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      address: ['', Validators.required],
    });

    this.dataSource = new MatTableDataSource<UserData>([]);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<UserData[]>('http://localhost:3000/api/getemployeeData').subscribe(
      (data) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Submitted:', this.userForm.value);

      const loginUrl = 'http://localhost:3000/api/employeeData';

      this.http.post(loginUrl, this.userForm.value).subscribe(
        (response) => {
          console.log('Response from server:', response);

          window.alert("Data added");

          // After successful submission, load the data again to refresh the table
          this.loadData();
        },
        (error) => {
          console.error('Error:', error);
        }
      )

      this.clearForm();
    }
  }

  editEmployee(user: UserData) {
    console.log('Edit employee:', user);
  }

  deleteEmployee(row: UserData) {
    console.log('Delete employee:', row);
  }

  editUser(user: UserData) {
    console.log('Edit user:', user);
  }

  deleteUser(user: UserData) {
    console.log('Delete user:', user);
  }

  
  clearForm(){
    // Reset the form fields
    this.userForm.reset();
  }
}

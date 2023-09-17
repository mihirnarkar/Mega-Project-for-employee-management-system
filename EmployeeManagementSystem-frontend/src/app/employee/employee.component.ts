import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

interface UserData {
  firstname: string;
  lastname: string;
  dob: string;
  email: string;
  address: string;
  contactno:string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {
  userForm!: FormGroup;
  displayedColumns: string[] = ['firstname', 'lastname','contactno','email','dob','address', 'action'];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.userForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      contactno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
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
      const dob = new Date(this.userForm.get('dob')?.value).toISOString().split('T')[0];
      const formData = {
        firstname: this.userForm.get('firstname')?.value,
        lastname: this.userForm.get('lastname')?.value,
        contactno: this.userForm.get('contactno')?.value,
        email: this.userForm.get('email')?.value,
        dob,
        address: this.userForm.get('address')?.value,
      };

      this.http.post('http://localhost:3000/api/employeeData', formData).subscribe(
        (response) => {
          window.alert('Data added');
          this.loadData();
        },
        (error) => {
          console.error('Error:', error);
        }
      );

      this.clearForm();
    }
  }

  clearForm() {
    this.userForm.reset();
  }

  editEmployee(user: UserData) {
    console.log('Edit employee:', user);
  }

  deleteEmployee(row: UserData) {
    // console.log('Delete employee:', row);
    const confirmDelete = confirm(`Are you sure you want to delete ${row.email} ?`);
    if(!confirmDelete){
      return;
    }
    const deleteUrl = `http://localhost:3000/api/deleteEmployee/${row.email}`;

    this.http.delete(deleteUrl).subscribe(()=>{
      console.log(`${row.email} deleted`);
      this.loadData();
      window.alert(`${row.email} deleted successfully`);
    },
    (error)=>{
      console.error(`Error deleting ${row.email}`);
      window.alert(`Error deleting ${row.email}`)
    });
  }

  editUser(user: UserData) {
    console.log('Edit user:', user);
  }

  deleteUser(user: UserData) {
    console.log('Delete user:', user);
  }
}

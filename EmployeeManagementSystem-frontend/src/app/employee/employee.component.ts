import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Observable, first } from 'rxjs';

interface UserData {
  firstname: string;
  lastname: string;
  dob: string;
  email: string;
  address: string;
  contactno: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {
  userForm!: FormGroup;
  displayedColumns: string[] = ['firstname', 'lastname', 'contactno', 'email', 'dob', 'address', 'action'];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);
  isEditMode: boolean = false; // Add this variable

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
      const email = this.userForm.get('email')?.value;
      const firstname = this.userForm.get('firstname')?.value;

      // Check if the email already exists in the database
      this.checkEmailExists(firstname,email).subscribe(
        (exists) => {
          if (exists) {
            // Email exists, update the employee
            this.updateEmployee(email);
          } else {
            // Email doesn't exist, add a new employee
            this.addEmployee();
          }
        },
        (error) => {
          console.error('Error checking email:', error);
        }
      );
    }
  }

  checkEmailExists(firstname: string,email: string): Observable<boolean> {
    const checkUrl = `http://localhost:3000/api/checkEmailExists/${firstname}/${email}`;
    return this.http.get<boolean>(checkUrl);
  }

  updateEmployee(email: string) {
    // Get the updated employee data from the form
    const updatedEmployeeData = {
      firstname: this.userForm.get('firstname')?.value,
      lastname: this.userForm.get('lastname')?.value,
      contactno: this.userForm.get('contactno')?.value,
      email: this.userForm.get('email')?.value,
      dob: new Date(this.userForm.get('dob')?.value).toISOString().split('T')[0],
      address: this.userForm.get('address')?.value,
    };

    const updateUrl = `http://localhost:3000/api/updateEmployee/${email}`;

    this.http.put(updateUrl, updatedEmployeeData).subscribe(
      () => {
        console.log(`${email} updated successfully`);
        window.alert(`${email} updated successfully`);
        this.loadData();
        this.clearForm();
      },
      (error) => {
        console.error(`Error updating ${email}:`, error);
        window.alert(`Error updating ${email}`);
      }
    );
  }

  addEmployee() {
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
      () => {
        window.alert('Data added');
        this.loadData();
        this.clearForm();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  clearForm() {
    this.userForm.reset();
    Object.keys(this.userForm.controls).forEach((key) => {
      this.userForm.get(key)?.setErrors(null);
      this.userForm.get(key)?.markAsPristine();
      this.userForm.get(key)?.markAsUntouched();
    });
  }

  editEmployee(user: UserData) {
    console.log('Edit employee:', user);
    // Set the form values for editing
    this.userForm.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      contactno: user.contactno,
      email: user.email,
      dob: user.dob,
      address: user.address,
    });
    this.isEditMode = true;
  }

  deleteEmployee(row: UserData) {
    const confirmDelete = confirm(`Are you sure you want to delete ${row.email} ?`);
    if (!confirmDelete) {
      return;
    }
    const deleteUrl = `http://localhost:3000/api/deleteEmployee/${row.email}`;

    this.http.delete(deleteUrl).subscribe(() => {
      console.log(`${row.email} deleted`);
      this.loadData();
      window.alert(`${row.email} deleted successfully`);
    },
      (error) => {
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

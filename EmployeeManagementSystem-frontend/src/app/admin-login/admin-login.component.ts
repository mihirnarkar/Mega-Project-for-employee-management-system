import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {

      // Prepare the user credentials
      const username = this.loginForm.get('username')?.value;
      let password = this.loginForm.get('password')?.value;

      // Format the dob as MM/DD/YYYY
      if (password.length === 8) {
        password = password.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      }

      // Send a POST request to your backend for authentication
      this.http.post<any>('http://localhost:3000/api/login', { username, password }).subscribe(
        (response) => {
          if (response.message === 'Login success' && response.token) {
            // Authentication successful store the token in localstorage
            localStorage.setItem('jwtToken',response.token);
            window.alert('Login success');
            this.router.navigate(['/welcome']);
          } else {
            // Authentication failed
            window.alert('Login failed');
          }
        },
        (error) => {
          console.error('Error:', error);
          window.alert('Username/password doesnt match');
        }
      );

      this.clearForm();

    }
  }


  clearForm(){
    // Reset the form fields
    this.loginForm.reset();


  }
}

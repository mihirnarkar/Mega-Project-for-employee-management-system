import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor( private router: Router){

  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  logout() {
    // Clear the JWT token from localStorage and navigate to the login page
    localStorage.removeItem('jwtToken');
    // You can also redirect to the home page or any other page after logout
    this.router.navigate(['/admin-login']);
  }
}

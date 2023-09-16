import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // User is authenticated
      return true;
    } else {
      // User is not authenticated, redirect to login page
      this.router.navigate(['/admin-login']);
      return false;
    }
  }
}

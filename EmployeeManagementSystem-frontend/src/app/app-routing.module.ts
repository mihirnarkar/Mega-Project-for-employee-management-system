import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { EmployeeComponent } from './employee/employee.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {path: '',component: HomeComponent},
  {path: 'admin-login',component: AdminLoginComponent},
  {path: 'employee',component: EmployeeComponent},
  {path: 'welcome',component: WelcomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

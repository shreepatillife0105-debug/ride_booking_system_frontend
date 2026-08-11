import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CustomerDashboardComponent } from './components/customer/customer-dashboard/customer-dashboard.component';
import { DriverDashboardComponent } from './components/driver/driver-dashboard/driver-dashboard.component';
import { SeconddriverComponent } from './driver/seconddriver/seconddriver.component';
import { SecondcustomerComponent } from './driver/secondcustomer/secondcustomer.component';

const routes: Routes = [
  { path:'', component:HomeComponent },
  { path:'customer', component:CustomerDashboardComponent },
  { path:'driver', component:DriverDashboardComponent},
  { path:'driver2', component:SeconddriverComponent},
  { path:'customer2', component:SecondcustomerComponent},
  { path:'**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

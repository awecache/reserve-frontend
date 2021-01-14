import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { NewReservationComponent } from './components/new-reservation/new-reservation.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { SuccessComponent } from './components/success/success.component';

const routes: Routes = [
  { path: 'reservation/new', component: NewReservationComponent },
  { path: 'reservation/edit', component: ReservationComponent },
  { path: 'reservation/confirm', component: ConfirmationComponent },
  { path: 'reservation/success', component: SuccessComponent },
  { path: 'manager/login', component: LoginComponent },
  { path: 'manager/dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

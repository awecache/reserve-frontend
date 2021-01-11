import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewReservationComponent } from './components/new-reservation/new-reservation.component';
import { ReservationComponent } from './components/reservation/reservation.component';

const routes: Routes = [
  { path: 'reservation/new', component: NewReservationComponent },
  { path: 'reservation/edit', component: ReservationComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

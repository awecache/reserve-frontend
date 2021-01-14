import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  constructor(
    private reservationSrv: ReservationService,
    private router: Router
  ) {}
  name?: string;
  contact?: string;
  email?: string;
  date?: string;
  time?: string;
  pax?: number;

  ngOnInit(): void {
    const {
      customerName,
      contact,
      email,
      reservedDate,
      reservedTime,
      reservedPax,
    } = this.reservationSrv;

    this.name = customerName;
    this.contact = contact;
    this.email = email;
    this.date = reservedDate;
    this.time = reservedTime;
    this.pax = reservedPax;
  }

  goHome() {
    this.router.navigate(['/']);
  }
}

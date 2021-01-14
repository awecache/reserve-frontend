import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationDetail } from 'src/app/models';
import { ReservationService } from 'src/app/services/reservation.service';

export interface PeriodicElement {
  time: string;
  pax: string;
  contact: string;
  name: string;
  table: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  form: FormGroup = this.fb.group({
    lunch: ['', []],
    dinner: ['', []],
    date: ['', [Validators.required]],
  });

  reservations: ReservationDetail[] = [];
  displayedColumns: string[] = ['time', 'pax', 'contact', 'name', 'table'];

  constructor(
    private fb: FormBuilder,
    private reservationSrv: ReservationService
  ) {}

  ngOnInit(): void {}

  updateReservationDetails(timestamp: number, start: string, end: string) {
    this.reservationSrv
      .getReservationsByRange(timestamp, start, end)
      .subscribe(async (res) => {
        console.log(res);
        const reservations = res.map((el) => {
          const { time, pax } = el;
          return {
            time,
            pax,
            customerId: el.customer_id,
            table: el.table_number,
          };
        });

        console.log('resr:', reservations);
        const reservationsDetails: ReservationDetail[] = [];

        for (const r of reservations) {
          const customerInfo = await this.reservationSrv.getCustomerInfo(
            r.customerId
          );

          const reservation = {
            time: r.time,
            pax: r.pax,
            name: customerInfo.name,
            contact: customerInfo.contact,
            table: r.table,
          };
          reservationsDetails.push(reservation);
          console.log('custInfo:', customerInfo);
        }
        console.log('resdetails:', reservationsDetails);
        this.reservations = reservationsDetails;
      });
  }

  search() {
    const lunchStart = '09:00:00';
    const lunchEnd = '15:00:00';
    const dinnerStart = '17:00:00';
    const dinnerEnd = '22:00:00';
    const isLunch = !!this.form.get('lunch')?.value;
    const isDinner = !!this.form.get('dinner')?.value;
    const date = this.form.get('date')?.value;
    const timestamp = date.unix();

    if (isLunch && !isDinner) {
      return this.updateReservationDetails(timestamp, lunchStart, lunchEnd);
    }

    if (isDinner && !isLunch) {
      return this.updateReservationDetails(timestamp, dinnerStart, dinnerEnd);
    }

    return this.updateReservationDetails(timestamp, lunchStart, dinnerEnd);
  }
}

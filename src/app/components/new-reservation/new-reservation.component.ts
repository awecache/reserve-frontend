import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  faClock,
  faUser,
  faCalendar,
} from '@fortawesome/free-regular-svg-icons';
import { Table, TimeSlot } from 'src/app/models';
import { ReservationService } from 'src/app/services/reservation.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.scss'],
})
export class NewReservationComponent implements OnInit {
  faClock = faClock;
  faUser = faUser;
  faCalendar = faCalendar;

  timeslots?: TimeSlot[];
  tables?: Table[];
  pax?: number[];

  successMessage: string = '';
  failMessage: string = '';

  reservedPax?: number;
  reservedTimestamp?: number;
  reservedTimeslotId?: number;

  reservedTime?: string;
  reservedDate?: string;

  // bookRef?: string;

  form: FormGroup = this.fb.group({
    timeslotId: ['', [Validators.required]],
    date: ['', [Validators.required]],
    pax: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private reservationSvr: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reservationSvr.getTimeslots().subscribe((res) => {
      this.timeslots = res;
    });

    this.reservationSvr.getTables().subscribe((res) => {
      this.tables = res;
      let maxPax = 0;
      res.forEach((table) => {
        maxPax = Math.max(table.max_pax, maxPax);
      });
      this.pax = Array.from({ length: maxPax }, (_, i) => i + 1);
    });
  }

  async checkAvailability() {
    this.failMessage = '';
    this.successMessage = '';

    const { timeslotId, date, pax } = this.form.value;
    const timestamp = (date as moment.Moment).unix();

    // console.log('date: ', timestamp);
    // console.log('formated: ', moment.unix(timestamp).format('MM/DD/YYYY'));

    const tables = await this.reservationSvr.getTables(pax).toPromise();

    const reservations = await this.reservationSvr
      .getReservationsByDateTime(timestamp, timeslotId)
      .toPromise();

    console.log('res', reservations);

    if (reservations.length) {
      reservations.forEach((r) => {
        const tableId = r.table_id;
        const tableIndex = tables.findIndex((t) => t.id === tableId);
        if (tableIndex !== -1) {
          tables.splice(tableIndex, 1);
        }
      });
    }

    const selectedDate = date.format('MM/DD/YYYY');
    // moment
    //   .unix(parseInt(reservations[0].date))
    //   .format('MM/DD/YYYY');

    const selectedTime = this.timeslots?.find((t) => t.id === timeslotId)?.time;

    if (!tables.length) {
      console.log('tables', tables.length);
      this.failMessage = `Sorry reservation on ${selectedDate} for ${pax} pax is not available as tables for ${pax} pax at ${selectedTime} are fully booked. Please try another date.`;
      return;
    }

    this.reservationSvr.tables = tables;
    this.reservationSvr.reservedPax = pax;
    this.reservationSvr.reservedTimestamp = timestamp;
    this.reservationSvr.reservedTimeslotId = timeslotId;

    this.reservationSvr.reservedTime = selectedTime;
    this.reservationSvr.reservedDate = selectedDate;

    this.successMessage = `Here is a table for you (${pax} pax ) on ${selectedDate} at ${selectedTime}. Continue to confirm your reservation.`;
    // console.log(
    //   'reservations date:',
    //   moment.unix(parseInt(reservations[0].date)).format('MM/DD/YYYY')
    // );
  }

  continue() {
    this.router.navigate(['/reservation/confirm']);
  }
}

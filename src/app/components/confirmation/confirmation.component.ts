import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  pax?: number;
  date?: string;
  time?: string;

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    contact: ['', [Validators.required]],
  });

  constructor(
    private reservationSvr: ReservationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('reserved date', this.reservationSvr.reservedDate);
    console.log('reserved time', this.reservationSvr.reservedTime);
    console.log('reserved pax', this.reservationSvr.reservedPax);
    console.log('tables', this.reservationSvr.tables);
    this.pax = this.reservationSvr.reservedPax;
    this.date = this.reservationSvr.reservedDate;
    this.time = this.reservationSvr.reservedTime;
  }

  async confirm() {
    console.log('confirm', this.form.value);
    const { name, contact } = this.form.value;

    try {
      const result = await this.reservationSvr
        .saveCustomerContact(name, contact)
        .toPromise();

      const {
        reservedTimestamp,
        tables,
        reservedTimeslotId,
        reservedPax,
      } = this.reservationSvr;
      const customerId = result?.customerId;

      if (
        customerId &&
        tables &&
        reservedTimestamp &&
        reservedTimeslotId &&
        reservedPax
      ) {
        //tableId
        console.log(tables);
        const tableId = tables[0].id;

        //bookRef
        //TBD hash
        const bookRef =
          tableId + contact + reservedTimestamp + reservedTimeslotId;
        this.reservationSvr
          .saveReservation(
            customerId,
            reservedTimestamp,
            tableId,
            reservedTimeslotId,
            reservedPax,
            bookRef
          )
          .subscribe((res) => {
            console.log('success res: ', res);
            if (res.status === 200) {
              console.log('show success page');

              //TBD load success
              return;
            }
            if (res.status === 404) {
              console.log('error');
              this.router.navigate([]);
              //TBD go back to new reservation
            }
          });
      }
    } catch (error) {
      console.log('error', error);
    }
  }
}

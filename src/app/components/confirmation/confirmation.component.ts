import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationConfirmation, ReservationDetail } from 'src/app/models';
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
    email: ['', [Validators.required]],
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
    const { name, contact, email } = this.form.value;

    try {
      const result = await this.reservationSvr
        .saveCustomerContact(name, contact, email)
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
          .subscribe(async (res) => {
            console.log('success res: ', res);
            if (res.status === 200) {
              console.log('show success page');

              //TBD load success
              this.reservationSvr.customerName = name;
              this.reservationSvr.contact = contact;
              this.reservationSvr.email = email;
              this.reservationSvr.bookRef = bookRef;

              const reservationConfirmation = {
                name: name || '',
                contact: contact || '',
                email: email || '',
                bookRef: bookRef || '',
                date: this.date || '',
                time: this.time || '',
                pax: this.pax || 0,
              };

              console.log('ref:', bookRef);
              await this.reservationSvr.sendConfirmation(
                reservationConfirmation
              );

              this.router.navigate(['/reservation/success']);
              return;
            }
            if (res.status === 404) {
              console.log('error');
              this.router.navigate(['/reservation/new']);
              //TBD go back to new reservation
            }
          });
      }
    } catch (error) {
      console.log('error', error);
    }
  }
}

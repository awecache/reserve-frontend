import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerInfo, ReservationView } from 'src/app/models';
import { ReservationService } from 'src/app/services/reservation.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit, OnDestroy {
  sub$?: Subscription;
  bookRef: string = '';
  reservation?: ReservationView;
  customerInfo?: CustomerInfo;

  constructor(
    private reservationSvr: ReservationService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }

  ngOnInit(): void {
    this.sub$ = this.route.params.subscribe(({ ref }) => {
      this.bookRef = ref;
    });

    this.reservationSvr
      .getReservationByBookRef(this.bookRef)
      .subscribe(async (res) => {
        if (res.length) {
          this.reservation = res[0];
          // console.log('idid:', res[0].customer_id);
          // this.customerInfo = await this.reservationSvr.getCustomerInfo(
          //   res[0].customer_id
          // );
          return;
        }
        this.goBack();
      });
  }

  cancelReservation() {
    this.reservationSvr.deleteReservation(this.bookRef).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.log('error: ', error);
      }
    );
  }

  goBack() {
    this.location.back();
  }
}

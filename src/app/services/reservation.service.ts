import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CustomerId,
  CustomerInfo,
  Reservation,
  ReservationConfirmation,
  ReservationView,
  Table,
  TimeSlot,
} from '../models';
import { AuthService } from './auth.service';

// const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  tables?: Table[];
  reservedPax?: number;
  reservedTimestamp?: number;
  reservedTimeslotId?: number;
  bookRef?: string;

  reservedTime?: string;
  reservedDate?: string;

  customerName?: string;
  contact?: string;
  email?: string;

  constructor(private http: HttpClient, private authSrv: AuthService) {}

  getTimeslots(): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>('/api/timeslots');
  }

  getTables(pax?: number, ignoreMin: string = 'false'): Observable<Table[]> {
    return !pax
      ? this.http.get<Table[]>('/api/tables', {
          params: new HttpParams().set('ignore_min', ignoreMin),
        })
      : this.http.get<Table[]>('/api/tables', {
          params: new HttpParams()
            .set('ignore_min', ignoreMin)
            .set('pax', pax.toString()),
        });
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>('/api/reservations');
  }

  getReservationsByDateTime(
    timestamp: number,
    timeslotId: number
  ): Observable<Reservation[]> {
    const params = new HttpParams()
      .set('date', timestamp.toString())
      .set('timeslot_id', timeslotId.toString());
    return this.http.get<Reservation[]>('/api/reservations', { params });
  }

  getReservationsByRange(
    timestamp: number,
    startTime: string,
    endTime: string
  ): Observable<ReservationView[]> {
    const params = new HttpParams()
      .set('date', timestamp.toString())
      .set('start_time', startTime)
      .set('end_time', endTime);
    return this.http.get<ReservationView[]>('/api/reservations', { params });
  }

  saveReservation(
    customerId: string,
    timestamp: number,
    tableId: number,
    timeslotId: number,
    pax: number,
    bookRef: string
  ) {
    return this.http.post(
      '/api/reservation',
      {
        customerId,
        timestamp: timestamp.toString(),
        tableId,
        pax,
        timeslotId,
        bookRef,
      },
      { observe: 'response' }
    );
  }

  sendConfirmation(reservationDetails: ReservationConfirmation) {
    console.log('sending mail', reservationDetails);
    return this.http.post('/api/send', reservationDetails).toPromise();
  }

  getCustomerInfo(id: string): Promise<CustomerInfo> {
    const token = this.authSrv.token;
    console.log('token:>', token);
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http
      .get<CustomerInfo>(`/api/customer/${id}`, { headers })
      .toPromise();
  }

  saveCustomerContact(
    name: string,
    contact: string,
    email: string
  ): Observable<CustomerId> {
    console.log('nam', name);
    console.log('contact', contact);
    return this.http.post<CustomerId>('/api/customer', {
      name,
      contact,
      email,
    });
  }
}

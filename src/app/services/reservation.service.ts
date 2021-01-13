import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerId, Reservation, Table, TimeSlot } from '../models';

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

  constructor(private http: HttpClient) {}

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

  saveCustomerContact(name: string, contact: string): Observable<CustomerId> {
    console.log('nam', name);
    console.log('contact', contact);
    return this.http.post<CustomerId>('/api/customer', { name, contact });
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
}

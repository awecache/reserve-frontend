export type Availability = 'both' | 'weekday' | 'weekend';

export interface TimeSlot {
  id: number;
  time: string;
  availability: Availability;
}

export interface Table {
  id: number;
  table_number: number;
  min_pax: number;
  max_pax: number;
}

export interface Reservation {
  id: number;
  date: string;
  //   '2020-01-10T16:00:00.000Z';
  timeslot_id: number;
  pax: number;
  name: string;
  table_id: number;
  contact_number: string;
  book_ref: number;
}

export interface ReservationView {
  availability: string;
  book_ref: string;
  customer_id: string;
  date: string;
  id: string;
  pax: string;
  table_id: string;
  time: string;
  table_number: string;
}

export interface ReservationDetail {
  time: string;
  pax: string;
  name: string;
  contact: string;
  table: string;
}

export interface ReservationConfirmation {
  name: string;
  contact: string;
  email: string;
  date: string;
  time: string;
  pax: number;
  bookRef: string;
}
export interface CustomerId {
  customerId: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthToken {
  message: string;
  token: string;
}

export interface CustomerInfo {
  id: string;
  name: string;
  contact: string;
}

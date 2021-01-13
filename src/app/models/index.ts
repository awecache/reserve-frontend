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

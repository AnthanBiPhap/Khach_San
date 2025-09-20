export interface BookingStatusActor {
  _id: string;
  fullName: string;
  email: string;
}

export interface BookingStatusBookingRef {
  _id: string;
  checkIn: string; // ISO string
  checkOut: string; // ISO string
}

export interface BookingStatusLog {
  _id: string;
  bookingId: BookingStatusBookingRef;
  actorId: BookingStatusActor;
  action: "check_in" | "check_out" | "cancel" | "extend" | "extend_check_out" | string;
  note?: string;
}

export interface BookingStatusPagination {
  totalRecord: number;
  limit: number;
  page: number;
}


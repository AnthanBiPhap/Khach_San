export interface BookingStatusActor {
  _id: string;
  fullName: string;
  email: string;
}

export interface BookingStatusGuestInfo {
  fullName: string;
  phoneNumber?: string;
  idNumber?: string;
  age?: number;
  email?: string;
}
export interface BookingStatusBookingRef {
  _id: string;
  checkIn: string; // ISO string
  checkOut: string; // ISO string
  roomNumber?: string;
  customerId?: { _id: string; fullName: string }; // nếu khách có tài khoản
  guestInfo?: BookingStatusGuestInfo;           // nếu walk-in
}
export interface BookingStatusLog {
  _id: string;
  bookingId: BookingStatusBookingRef;
  actorId?: BookingStatusActor | null;  // nếu là khách không có tk thì null
  actorName?: string;                    // tên hiển thị khi khách không có tk hoặc admin/staff thao tác
  action: "check_in" | "check_out" | "cancel" | "extend" | "extend_check_out" | string;
  note?: string;
}


export interface BookingStatusPagination {
  totalRecord: number;
  limit: number;
  page: number;
}


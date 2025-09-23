interface User {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
}

interface Room {
  _id: string;
  roomNumber: string;
  typeId: string;
}

export interface GuestInfo {
  fullName: string;
  phoneNumber: string;
  idNumber: string; // thêm cái này
  age: number;
}


export interface Booking {
  _id: string;
  // Nếu khách có tài khoản thì customerId, nếu walk-in thì guestInfo
  customerId?: User; 
  guestInfo?: GuestInfo;
  roomId: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

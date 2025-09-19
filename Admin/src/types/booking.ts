interface User {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
}
  
  interface Room {
    _id: string;
    roomNumber: string;
    typeId: string;
}
export interface Booking {
  _id: string;
  customerId: User;
  roomId: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}
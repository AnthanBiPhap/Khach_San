interface User {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
}
export interface GuestInfo {
  fullName: string;
  phoneNumber: string;
  idNumber: string; // thêm cái này
  age: number;
  actualCheckIn?: string;  // thêm vào
  actualCheckOut?: string; // thêm vào
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
  extendHours?: number;
}
export interface RoomType {
  _id: string;
  name: string;
  pricePerNight: number;
  extraHourPrice?: number;
  maxExtendHours?: number;
  capacity: number;
}

export interface Room {
  _id: string;
  roomNumber: string;
  typeId?: RoomType;
  status: string;
  amenities?: string[];
}

export interface BookingFormProps {
  open: boolean;
  booking?: Booking | null;
  onCancel: () => void;
  onSave: (values: Partial<Booking>) => Promise<void>;
  loading?: boolean;
}

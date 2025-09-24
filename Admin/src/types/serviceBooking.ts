export interface ServiceRef {
  _id: string;
  name?: string;
}

export interface BookingRef {
  _id: string;
}

export interface UserRef {
  _id: string;
  fullName?: string;
  email?: string;
}

export interface ServiceBookingItem {
  _id: string;
  bookingId?: BookingRef | null;
  serviceId?: ServiceRef | null;
  customerId?: UserRef | null;
  scheduledAt: string; // ISO
  quantity: number;
  price: number;
  status: "reserved" | "completed" | "cancelled" | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceBookingsFormProps {
  open: boolean;
  item?: ServiceBookingItem | null;
  onCancel: () => void;
  onSave: (values: Partial<ServiceBookingItem>) => Promise<void>;
  loading?: boolean;
}
export interface SimpleRef { _id: string; name?: string; fullName?: string }

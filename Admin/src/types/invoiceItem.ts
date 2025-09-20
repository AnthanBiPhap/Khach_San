export type InvoiceItemType = "room" | "service" | "late_fee" | "other" | string;

export interface InvoiceRef {
  _id: string;
  bookingId?: string;
  customerId?: string;
  totalAmount?: number;
  status?: string;
}

export interface InvoiceItemEntry {
  _id: string;
  invoiceId: InvoiceRef;
  itemType: InvoiceItemType;
  description: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

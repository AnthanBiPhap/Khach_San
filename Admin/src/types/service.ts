export interface ServiceItem {
  _id: string;
  name: string;
  description?: string;
  basePrice: number;
  slots?: string[];
  images?: string[];
  status: "active" | "hidden" | "deleted" | string;
  createdAt?: string;
  updatedAt?: string;
}

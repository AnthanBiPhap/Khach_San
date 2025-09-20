export interface RoomType {
    _id: string;
    name: string;
    pricePerNight: number;
    capacity: number;
    description?: string;
    amenities?: string[];
    images?: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Room {
    _id: string;
    roomNumber: string;
    typeId?: RoomType;
    status: string;
    amenities?: string[];
    createdAt?: string;
    updatedAt?: string;
  }

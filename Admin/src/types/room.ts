export interface RoomType {
    _id: string;
    name: string;
    pricePerNight: number;
    capacity: number;
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

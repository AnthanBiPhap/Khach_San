import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

export interface Booking {
  _id: string;
  roomId: {
    _id: string;
    roomNumber: string;
    typeId: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  guestInfo: {
    fullName: string;
    idNumber: string;
    age: number;
    phoneNumber: string;
    email?: string;
  };
  paymentStatus: string;
  totalPrice: number;
  services: Array<{
    serviceId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface Room {
  _id: string;
  roomNumber: string;
  typeId: {
    _id: string;
    name: string;
    pricePerNight: number;
    capacity: number;
  };
  status: 'available' | 'booked' | 'maintenance';
  amenities: string[];
}

export const bookingService = {
  // Lấy danh sách đặt phòng
  getBookings: async (): Promise<{ bookings: Booking[] }> => {
    const response = await axios.get(`${API_URL}/bookings`);
    return response.data.data;
  },

  // Lấy danh sách phòng
  getRooms: async (): Promise<{ rooms: Room[] }> => {
    const response = await axios.get(`${API_URL}/rooms`);
    return response.data.data;
  },

  // Kiểm tra phòng trống
  checkRoomAvailability: async (checkIn: string, checkOut: string): Promise<Room[]> => {
    // Lấy tất cả phòng
    const { rooms } = await bookingService.getRooms();
    
    // Lấy tất cả booking trong khoảng thời gian
    const { bookings } = await bookingService.getBookings();
    
    // Lọc ra các phòng đã được đặt trong khoảng thời gian này
    const bookedRoomIds = bookings
      .filter(booking => {
        const bookingCheckIn = new Date(booking.checkIn);
        const bookingCheckOut = new Date(booking.checkOut);
        const searchCheckIn = new Date(checkIn);
        const searchCheckOut = new Date(checkOut);
        
        // Kiểm tra xem khoảng thời gian đặt phòng có trùng với khoảng thời gian tìm kiếm không
        return (
          (bookingCheckIn <= searchCheckOut && bookingCheckOut >= searchCheckIn) &&
          booking.paymentStatus !== 'cancelled'
        );
      })
      .map(booking => booking.roomId._id);
    
    // Lọc ra các phòng còn trống
    const availableRooms = rooms.filter(
      room => 
        !bookedRoomIds.includes(room._id) && 
        room.status === 'available'
    );
    
    return availableRooms;
  }
};

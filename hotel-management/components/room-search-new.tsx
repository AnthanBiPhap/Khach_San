"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useRoomSearch } from '@/hooks/useRoomSearch';
import { Calendar, Users, Bed, MapPin, Wifi, Tv, Coffee, WashingMachine, Utensils, Dumbbell, ParkingCircle, Snowflake } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function RoomSearch() {
  const {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    availableRooms,
    loading,
    error,
    searchRooms,
  } = useRoomSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRooms();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-8 relative z-10">
      <h2 className="text-2xl font-bold text-center mb-6">Tìm kiếm phòng</h2>
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ngày nhận phòng</label>
            <Input 
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ngày trả phòng</label>
            <Input 
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Số khách</label>
            <Select 
              value={guests.toString()} 
              onValueChange={(value) => setGuests(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn số khách" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 khách</SelectItem>
                <SelectItem value="2">2 khách</SelectItem>
                <SelectItem value="3">3 khách</SelectItem>
                <SelectItem value="4">4 khách</SelectItem>
                <SelectItem value="5">5+ khách</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Đang tìm...' : 'Tìm kiếm'}
            </Button>
          </div>
        </div>
        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}
      </form>

      {availableRooms.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Các phòng có sẵn:</h3>
          <div className="space-y-4">
            {availableRooms.map((room) => (
              <div key={room._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Phòng {room.roomNumber} - {room.typeId.name}</h4>
                    <p className="text-gray-600">Sức chứa: {room.typeId.capacity} người</p>
                    <p className="text-gray-600">Giá: {room.typeId.pricePerNight.toLocaleString()} VNĐ/đêm</p>
                    <div className="mt-2">
                      <span className="text-sm font-medium">Tiện ích:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {room.amenities?.map((amenity: string, index: number) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Đặt ngay
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

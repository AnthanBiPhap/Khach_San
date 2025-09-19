"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, Car, Coffee, Waves, Utensils, Dumbbell, Bed, Users, Square } from "lucide-react"

interface Room {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  amenities: string[]
  maxGuests: number
  size: number
  available: boolean
}

const rooms: Room[] = [
  {
    id: "deluxe",
    name: "Phòng Deluxe",
    description: "Phòng sang trọng với view biển tuyệt đẹp và đầy đủ tiện nghi hiện đại",
    price: 2500000,
    originalPrice: 3000000,
    image: "/luxury-ocean-view-hotel.png",
    amenities: ["Wifi miễn phí", "Bãi đỗ xe", "Minibar", "View biển"],
    maxGuests: 2,
    size: 35,
    available: true,
  },
  {
    id: "suite",
    name: "Suite Gia Đình",
    description: "Không gian rộng rãi hoàn hảo cho gia đình với phòng khách riêng biệt",
    price: 4200000,
    originalPrice: 5000000,
    image: "/family-suite-hotel-room-with-living-area.jpg",
    amenities: ["Wifi miễn phí", "Bãi đỗ xe", "Phòng khách", "Bếp nhỏ", "Ban công"],
    maxGuests: 4,
    size: 65,
    available: true,
  },
  {
    id: "presidential",
    name: "Phòng Tổng Thống",
    description: "Đỉnh cao của sự sang trọng với dịch vụ butler riêng và tiện nghi 5 sao",
    price: 8500000,
    image: "/presidential-suite-luxury-hotel-room.jpg",
    amenities: ["Butler riêng", "Spa riêng", "Hồ bơi riêng", "Phòng ăn", "Phòng làm việc"],
    maxGuests: 6,
    size: 120,
    available: false,
  },
  {
    id: "standard",
    name: "Phòng Standard",
    description: "Phòng tiện nghi với thiết kế hiện đại, phù hợp cho chuyến công tác",
    price: 1800000,
    originalPrice: 2200000,
    image: "/modern-standard-hotel-room.jpg",
    amenities: ["Wifi miễn phí", "Điều hòa", "TV màn hình phẳng", "Minibar"],
    maxGuests: 2,
    size: 25,
    available: true,
  },
]

const amenityIcons: Record<string, any> = {
  "Wifi miễn phí": Wifi,
  "Bãi đỗ xe": Car,
  Minibar: Coffee,
  "View biển": Waves,
  "Phòng ăn": Utensils,
  "Spa riêng": Dumbbell,
  "Butler riêng": Users,
  "Hồ bơi riêng": Waves,
  "Phòng khách": Bed,
  "Bếp nhỏ": Coffee,
  "Ban công": Square,
  "Điều hòa": Square,
  "TV màn hình phẳng": Square,
  "Phòng làm việc": Square,
}

export function RoomBooking() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Chọn Phòng Phù Hợp</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Từ phòng tiêu chuẩn đến suite tổng thống, chúng tôi có đầy đủ lựa chọn cho mọi nhu cầu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
                selectedRoom === room.id ? "ring-2 ring-primary" : ""
              } ${!room.available ? "opacity-75" : ""}`}
            >
              <div className="relative">
                <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-64 object-cover" />
                {!room.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Hết phòng
                    </Badge>
                  </div>
                )}
                {room.originalPrice && (
                  <Badge className="absolute top-4 right-4 bg-destructive">
                    Giảm {Math.round((1 - room.price / room.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{room.name}</CardTitle>
                    <CardDescription className="text-sm">{room.description}</CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {room.maxGuests} khách
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    {room.size}m²
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map((amenity) => {
                      const Icon = amenityIcons[amenity] || Square
                      return (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          <Icon className="h-3 w-3 mr-1" />
                          {amenity}
                        </Badge>
                      )
                    })}
                    {room.amenities.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.amenities.length - 4} tiện ích
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{formatPrice(room.price)}</span>
                        {room.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(room.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">/ đêm</span>
                    </div>

                    <Button
                      onClick={() => setSelectedRoom(room.id)}
                      disabled={!room.available}
                      className="min-w-[100px]"
                    >
                      {selectedRoom === room.id ? "Đã chọn" : "Chọn phòng"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedRoom && (
          <div className="mt-12 text-center">
            <Card className="max-w-md mx-auto bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Phòng đã chọn</h3>
                <p className="text-sm text-muted-foreground mb-4">{rooms.find((r) => r.id === selectedRoom)?.name}</p>
                <Button size="lg" className="w-full">
                  Tiếp tục đặt phòng
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}

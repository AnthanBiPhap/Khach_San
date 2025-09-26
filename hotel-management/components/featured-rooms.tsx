"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Wifi, Car, Coffee, Waves } from "lucide-react"

interface Room {
  id: number
  name: string
  roomType: {
    name: string
    price: number
  }
  status: string
  amenities: string[]
}

export function FeaturedRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/rooms")
      const data = await response.json()
      setRooms(data.slice(0, 6)) // Show first 6 rooms
    } catch (error) {
      console.error("Error fetching rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "breakfast":
        return <Coffee className="h-4 w-4" />
      case "pool":
        return <Waves className="h-4 w-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Đang tải...</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Phòng nổi bật</h2>
          <p className="text-xl text-muted-foreground">Những lựa chọn tốt nhất cho kỳ nghỉ của bạn</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={`/.jpg?height=200&width=300&query=${room.roomType.name} hotel room`}
                  alt={room.name}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className={`absolute top-3 left-3 ${
                    room.status === "available" ? "bg-green-500" : "bg-red-500"
                  } text-white`}
                >
                  {room.status === "available" ? "Còn trống" : "Hết phòng"}
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{room.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-3">{room.roomType.name}</p>

                {/* Amenities */}
                <div className="flex items-center gap-2 mb-4">
                  {room.amenities.slice(0, 4).map((amenity, index) => (
                    <div key={index} className="flex items-center text-muted-foreground">
                      {getAmenityIcon(amenity)}
                      <span className="text-xs ml-1">{amenity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-500">₫{room.roomType.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">/đêm</div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={room.status !== "available"}>
                    {room.status === "available" ? "Đặt ngay" : "Hết phòng"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
            Xem tất cả phòng
          </Button>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays, MapPin, Users } from "lucide-react"

export function HotelHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder-cq15c.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Khám Phá Vẻ Đẹp
            <span className="block text-primary"> Việt Nam</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto text-pretty">
            Trải nghiệm kỳ nghỉ sang trọng tại những khách sạn đẳng cấp nhất với dịch vụ hoàn hảo
          </p>

          {/* Booking Form */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="checkin" className="text-foreground flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Ngày nhận phòng
                  </Label>
                  <Input id="checkin" type="date" className="bg-background" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkout" className="text-foreground flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Ngày trả phòng
                  </Label>
                  <Input id="checkout" type="date" className="bg-background" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests" className="text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Số khách
                  </Label>
                  <Input id="guests" type="number" min="1" max="10" defaultValue="2" className="bg-background" />
                </div>

                <Button size="lg" className="h-12 text-lg font-semibold">
                  <MapPin className="h-5 w-5 mr-2" />
                  Tìm Phòng
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-200">Khách sạn</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-gray-200">Địa điểm</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-200">Khách hàng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.9</div>
              <div className="text-gray-200">Đánh giá</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

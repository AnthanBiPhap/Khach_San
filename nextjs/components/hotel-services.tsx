"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Wifi,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  Space as Spa,
  Coffee,
  Shield,
  Clock,
  Users,
  MapPin,
  Phone,
} from "lucide-react"

const services = [
  {
    icon: Wifi,
    title: "WiFi Miễn Phí",
    description: "Internet tốc độ cao trong toàn bộ khu vực khách sạn",
    category: "Tiện ích",
  },
  {
    icon: Car,
    title: "Đỗ Xe Miễn Phí",
    description: "Bãi đỗ xe rộng rãi, an toàn 24/7",
    category: "Tiện ích",
  },
  {
    icon: Utensils,
    title: "Nhà Hàng Cao Cấp",
    description: "Ẩm thực Việt Nam và quốc tế với đầu bếp chuyên nghiệp",
    category: "Ẩm thực",
  },
  {
    icon: Coffee,
    title: "Quầy Bar & Cafe",
    description: "Thưởng thức cà phê và cocktail với view tuyệt đẹp",
    category: "Ẩm thực",
  },
  {
    icon: Waves,
    title: "Hồ Bơi Vô Cực",
    description: "Hồ bơi ngoài trời với tầm nhìn ra biển",
    category: "Giải trí",
  },
  {
    icon: Dumbbell,
    title: "Phòng Gym 24/7",
    description: "Trang thiết bị hiện đại, mở cửa 24 giờ",
    category: "Giải trí",
  },
  {
    icon: Spa,
    title: "Spa & Massage",
    description: "Dịch vụ spa thư giãn với liệu pháp truyền thống",
    category: "Chăm sóc",
  },
  {
    icon: Shield,
    title: "Bảo Mật 24/7",
    description: "An ninh chuyên nghiệp, camera giám sát toàn khu vực",
    category: "An toàn",
  },
  {
    icon: Clock,
    title: "Lễ Tân 24/7",
    description: "Đội ngũ lễ tân nhiệt tình, hỗ trợ mọi lúc",
    category: "Dịch vụ",
  },
  {
    icon: Users,
    title: "Phòng Hội Nghị",
    description: "Không gian tổ chức sự kiện, hội nghị chuyên nghiệp",
    category: "Dịch vụ",
  },
  {
    icon: MapPin,
    title: "Tour Du Lịch",
    description: "Tư vấn và tổ chức tour tham quan địa điểm nổi tiếng",
    category: "Du lịch",
  },
  {
    icon: Phone,
    title: "Dịch Vụ Phòng",
    description: "Room service 24/7, giặt ủi, dọn phòng theo yêu cầu",
    category: "Dịch vụ",
  },
]

const categories = ["Tất cả", "Tiện ích", "Ẩm thực", "Giải trí", "Chăm sóc", "An toàn", "Dịch vụ", "Du lịch"]

export function HotelServices() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-emerald-600 border-emerald-200">
            Dịch Vụ Khách Sạn
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Trải Nghiệm Dịch Vụ Đẳng Cấp</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Chúng tôi cam kết mang đến cho bạn những dịch vụ tốt nhất với tiêu chuẩn quốc tế, đảm bảo kỳ nghỉ của bạn
            trở nên hoàn hảo và đáng nhớ.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "Tất cả" ? "default" : "outline"}
              size="sm"
              className={category === "Tất cả" ? "bg-emerald-600 hover:bg-emerald-700" : "hover:bg-emerald-50"}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                    <IconComponent className="w-8 h-8 text-emerald-600" />
                  </div>
                  <Badge variant="secondary" className="mb-3 text-xs bg-emerald-50 text-emerald-700">
                    {service.category}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Cần Hỗ Trợ Thêm?</h3>
          <p className="text-emerald-100 mb-8 text-lg max-w-2xl mx-auto">
            Đội ngũ nhân viên chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ để được tư vấn chi
            tiết về các dịch vụ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-emerald-50">
              <Phone className="w-5 h-5 mr-2" />
              Gọi Ngay: (84) 123 456 789
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-emerald-600 bg-transparent"
            >
              Xem Thêm Dịch Vụ
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

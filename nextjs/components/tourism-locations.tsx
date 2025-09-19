"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Camera, Waves, Building2, TreePine } from "lucide-react"

interface Location {
  id: string
  name: string
  description: string
  image: string
  category: string
  rating: number
  duration: string
  distance: string
  highlights: string[]
  price: number
}

const locations: Location[] = [
  {
    id: "halong-bay",
    name: "Vịnh Hạ Long",
    description: "Di sản thế giới với hàng nghìn đảo đá vôi kỳ thú nổi lên từ nước biển xanh ngọc bích",
    image: "/placeholder.svg?key=halong",
    category: "Thiên nhiên",
    rating: 4.8,
    duration: "1 ngày",
    distance: "3.5km",
    highlights: ["Du thuyền sang trọng", "Hang Sửng Sốt", "Đảo Titop", "Làng chài Cửa Vạn"],
    price: 1200000,
  },
  {
    id: "hoi-an",
    name: "Phố Cổ Hội An",
    description: "Thành phố cổ quyến rũ với kiến trúc truyền thống và văn hóa đa dạng",
    image: "/placeholder.svg?key=hoian",
    category: "Văn hóa",
    rating: 4.9,
    duration: "2 ngày",
    distance: "15km",
    highlights: ["Chùa Cầu", "Phố đèn lồng", "Ẩm thực đường phố", "Làng gốm Thanh Hà"],
    price: 800000,
  },
  {
    id: "sapa",
    name: "Sapa - Ruộng Bậc Thang",
    description: "Vùng núi tuyệt đẹp với ruộng bậc thang và văn hóa dân tộc thiểu số",
    image: "/placeholder.svg?key=sapa",
    category: "Thiên nhiên",
    rating: 4.7,
    duration: "3 ngày",
    distance: "45km",
    highlights: ["Ruộng bậc thang", "Đỉnh Fansipan", "Bản Cát Cát", "Chợ tình Sapa"],
    price: 2500000,
  },
  {
    id: "hcm-city",
    name: "TP. Hồ Chí Minh",
    description: "Thành phố năng động với kiến trúc hiện đại và di tích lịch sử",
    image: "/placeholder.svg?key=hcm",
    category: "Thành phố",
    rating: 4.6,
    duration: "2 ngày",
    distance: "25km",
    highlights: ["Dinh Độc Lập", "Chợ Bến Thành", "Phố đi bộ Nguyễn Huệ", "Địa đạo Củ Chi"],
    price: 1500000,
  },
  {
    id: "phu-quoc",
    name: "Đảo Phú Quốc",
    description: "Hòn đảo thiên đường với bãi biển trắng mịn và nước biển trong xanh",
    image: "/placeholder.svg?key=phuquoc",
    category: "Biển đảo",
    rating: 4.8,
    duration: "4 ngày",
    distance: "8km",
    highlights: ["Bãi Sao", "Cáp treo Hòn Thơm", "Chợ đêm Dinh Cậu", "Vườn tiêu"],
    price: 3200000,
  },
  {
    id: "da-nang",
    name: "Đà Nẵng - Bà Nà Hills",
    description: "Thành phố biển hiện đại với cầu Vàng nổi tiếng và khu du lịch Bà Nà Hills",
    image: "/placeholder.svg?key=danang",
    category: "Thành phố",
    rating: 4.7,
    duration: "2 ngày",
    distance: "12km",
    highlights: ["Cầu Vàng", "Bà Nà Hills", "Bãi biển Mỹ Khê", "Chùa Linh Ứng"],
    price: 1800000,
  },
]

const categoryIcons: Record<string, any> = {
  "Thiên nhiên": TreePine,
  "Văn hóa": Building2,
  "Thành phố": Building2,
  "Biển đảo": Waves,
}

const categoryColors: Record<string, string> = {
  "Thiên nhiên": "bg-green-100 text-green-800",
  "Văn hóa": "bg-purple-100 text-purple-800",
  "Thành phố": "bg-blue-100 text-blue-800",
  "Biển đảo": "bg-cyan-100 text-cyan-800",
}

export function TourismLocations() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Khám Phá Địa Điểm Du Lịch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Từ vịnh Hạ Long huyền thoại đến phố cổ Hội An quyến rũ, khám phá những điểm đến tuyệt vời nhất Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => {
            const CategoryIcon = categoryIcons[location.category] || MapPin
            return (
              <Card key={location.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={location.image || "/placeholder.svg"}
                    alt={location.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={categoryColors[location.category]}>
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {location.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-black/70 text-white">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {location.rating}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{location.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{location.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {location.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location.distance}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Điểm nổi bật:</h4>
                      <div className="flex flex-wrap gap-1">
                        {location.highlights.slice(0, 3).map((highlight) => (
                          <Badge key={highlight} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                        {location.highlights.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{location.highlights.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-lg font-bold text-primary">{formatPrice(location.price)}</span>
                        <span className="text-sm text-muted-foreground ml-1">/ người</span>
                      </div>
                      <Button size="sm" className="gap-2">
                        <Camera className="h-4 w-4" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="gap-2 bg-transparent">
            <MapPin className="h-5 w-5" />
            Xem tất cả địa điểm
          </Button>
        </div>
      </div>
    </section>
  )
}

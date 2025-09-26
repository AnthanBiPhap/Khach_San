'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, MapPin, Star, Hotel, Utensils, Landmark, Mountain } from 'lucide-react';
import Link from 'next/link';

export default function ExplorePage() {
  const { user } = useAuth();

  const features = [
    { icon: <Hotel className="h-6 w-6 text-primary" />, text: 'Hơn 100 phòng nghỉ tiện nghi' },
    { icon: <Utensils className="h-6 w-6 text-primary" />, text: 'Nhà hàng đa dạng ẩm thực' },
    { icon: <Mountain className="h-6 w-6 text-primary" />, text: 'View đẹp, không gian thoáng đãng' },
    { icon: <Landmark className="h-6 w-6 text-primary" />, text: 'Gần các điểm du lịch nổi tiếng' },
  ];

  return (
    <div className="min-h-screen">
      {!user ? (
        <div className="min-h-[90vh] flex items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left side - Content */}
                <div className="space-y-6 animate-fade-in">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    Tìm khách sạn hoàn hảo cho chuyến đi của bạn
                  </h1>
                  <p className="text-xl text-blue-100 max-w-xl">
                    Hơn 1,000+ khách sạn chất lượng với giá tốt nhất. Đặt ngay, thanh toán sau!
                  </p>

                  <div className="flex flex-col space-y-3 pt-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <span className="font-medium">4.8/5 (12,000+ đánh giá)</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-blue-100">
                      <MapPin className="h-5 w-5" />
                      <span>63 tỉnh thành trên khắp Việt Nam</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-8">
                    <Button asChild size="lg" className="px-8 py-6 text-lg bg-amber-500 hover:bg-amber-600 text-white">
                      <Link href="/auth/register" className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Đặt phòng ngay
                      </Link>
                    </Button>
                  
                    <Button variant="outline" asChild size="lg" className="px-8 py-6 text-lg border-white text-white hover:bg-white/10">
                      <Link href="/auth/login" className="flex items-center gap-2">
                        <LogIn className="h-5 w-5" />
                        Đăng nhập để khám phá
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Right side - Featured Hotel Card */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <div className="relative h-64 bg-cover bg-center" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")'}}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <h3 className="text-xl font-bold">Khách sạn Luxury Palace</h3>
                            <p className="text-blue-100">Quận 1, TP. Hồ Chí Minh</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">₫2,500,000</p>
                            <p className="text-sm text-blue-100">/đêm</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      GIẢM 15%
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center text-center space-y-2 p-4 bg-white rounded-lg shadow-sm card-hover"
                  >
                    <div className="p-3 bg-blue-50 rounded-full">
                      {feature.icon}
                    </div>
                    <p className="font-medium text-gray-700">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Khám phá trải nghiệm đặc biệt</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chào mừng {user.email}, hãy khám phá những ưu đãi đặc biệt dành riêng cho bạn
            </p>
          </div>
          
          {/* Add your location explorer or other content here */}
        </div>
      )}
    </div>
  );
}

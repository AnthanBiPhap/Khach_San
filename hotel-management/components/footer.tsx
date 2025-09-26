"use client"

import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-4">Miko Hotel</div>
            <p className="text-gray-300 mb-4">
              Khách sạn đẳng cấp 5 sao với dịch vụ chuyên nghiệp và tiện nghi hiện đại.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">123 Nguyễn Huệ, Q1, TP.HCM</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">1900 1234</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">info@mikohotel.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Đặt phòng khách sạn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Vé máy bay
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Tour du lịch
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Xe đưa đón
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Download */}
          <div>
            <h3 className="font-semibold mb-4">Tải ứng dụng</h3>
            <div className="space-y-3">
              <img src="/app-store-download-button.jpg" alt="Download on App Store" className="h-10" />
              <img src="/google-play-download-button.png" alt="Get it on Google Play" className="h-10" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Miko Hotel. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function StoreFooter() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">Ecom</span>
            </div>
            <p className="text-sm leading-relaxed">
              Nền tảng mua sắm trực tuyến hàng đầu Việt Nam. Mang đến trải nghiệm mua sắm tuyệt vời với hàng triệu sản phẩm chất lượng.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="hover:bg-blue-600 hover:text-white transition-colors" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-blue-400 hover:text-white transition-colors" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-pink-600 hover:text-white transition-colors" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-red-600 hover:text-white transition-colors" asChild>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Liên Kết</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Điều Khoản Dịch Vụ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Chính Sách Vận Chuyển
                </Link>
              </li>
            </ul>
          </div>

          

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Liên Hệ</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">123 Nguyễn Văn Linh, Quận 7, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">1900 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">support@ecom.vn</span>
              </li>
            </ul>
            
            <div>
              <h4 className="text-white font-medium mb-2">Đăng Ký Nhận Tin</h4>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                />
                <Button className="bg-[rgb(37,99,235)] hover:bg-[rgb(29,78,216)] text-white">
                  Gửi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 Ecom. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/help" className="hover:text-white transition-colors">
                Trợ Giúp
              </Link>
              <Link to="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
              <Link to="/returns" className="hover:text-white transition-colors">
                Đổi Trả Hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default StoreFooter
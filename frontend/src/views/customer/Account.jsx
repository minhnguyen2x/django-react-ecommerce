import React from 'react'
import Sidebar from './Sidebar'
import UseProfileData from '../plugin/UseProfileData'
import { Link } from 'react-router-dom'
import { FaUser, FaShoppingCart, FaMapMarkerAlt, FaKey, FaCog, FaHeart } from 'react-icons/fa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollToTop } from '@/components/ui/scroll-to-top'


function Account() {
  const userProfile = UseProfileData()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-[rgb(37,99,235)] to-[rgb(29,78,216)] text-white">
                <CardTitle className="text-2xl">
                  <FaUser className="inline-block mr-2" />
                  Xin chào, {userProfile?.full_name}!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Welcome Message */}
                  <div className="bg-blue-50 border-l-4 border-[rgb(37,99,235)] p-4 rounded">
                    <p className="text-gray-700 leading-relaxed">
                      Từ trang quản lý tài khoản, bạn có thể dễ dàng xem và quản lý các thông tin của mình.
                    </p>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Orders */}
                    <Link to="/customer/orders/">
                      <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-[rgb(37,99,235)]">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <FaShoppingCart className="text-[rgb(37,99,235)] text-xl" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg mb-1">Đơn Hàng</h3>
                              <p className="text-sm text-gray-600">
                                Xem và theo dõi các đơn hàng của bạn
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Wishlist */}
                    <Link to="/customer/wishlist/">
                      <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-[rgb(37,99,235)]">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <FaHeart className="text-red-500 text-xl" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg mb-1">Yêu Thích</h3>
                              <p className="text-sm text-gray-600">
                                Quản lý danh sách sản phẩm yêu thích
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Address */}
                    <Link to="/customer/settings/">
                      <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-[rgb(37,99,235)]">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <FaMapMarkerAlt className="text-green-500 text-xl" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg mb-1">Địa Chỉ</h3>
                              <p className="text-sm text-gray-600">
                                Quản lý địa chỉ giao hàng
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Change Password */}
                    <Link to="/customer/settings/">
                      <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-[rgb(37,99,235)]">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <FaKey className="text-yellow-600 text-xl" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg mb-1">Đổi Mật Khẩu</h3>
                              <p className="text-sm text-gray-600">
                                Thay đổi mật khẩu tài khoản
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Account Settings */}
                    <Link to="/customer/settings/">
                      <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-[rgb(37,99,235)]">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <FaCog className="text-purple-500 text-xl" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg mb-1">Cài Đặt</h3>
                              <p className="text-sm text-gray-600">
                                Chỉnh sửa thông tin tài khoản
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Notifications */}
                    <Link to="/customer/notifications/">
                      <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-[rgb(37,99,235)]">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg mb-1">Thông Báo</h3>
                              <p className="text-sm text-gray-600">
                                Xem thông báo của bạn
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>

                  {/* Account Info */}
                  <Card className="mt-6 bg-gray-50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4">Thông Tin Tài Khoản</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Họ và Tên</p>
                          <p className="font-medium">{userProfile?.full_name || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{userProfile?.email || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Số Điện Thoại</p>
                          <p className="font-medium">{userProfile?.phone || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Ngày Tham Gia</p>
                          <p className="font-medium">{userProfile?.date ? new Date(userProfile.date).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <ScrollToTop />
    </div>
  )
}

export default Account
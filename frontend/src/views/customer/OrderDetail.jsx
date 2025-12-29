import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FaShoppingCart, FaDollarSign, FaCreditCard, FaTruck, FaFileInvoice, FaTools, FaGift, FaMapMarkerAlt } from 'react-icons/fa'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

function OrderDetail() {
  const [order, setOrder] = useState([])
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)

  const axios = apiInstance
  const userData = UserData()
  const param = useParams()
  console.log(param);

  useEffect(() => {
    axios.get(`customer/order/detail/${userData?.user_id}/${param?.order_oid}`).then((res) => {
      setOrder(res.data);
      setOrderItems(res.data.orderitem);
      if (order) {
        setLoading(false)
      }
    })
  }, [])

  console.log(order);

  return (
    <div className="min-h-screen bg-white">
      {loading === false &&
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
                    <FaShoppingCart className="inline-block mr-2" />
                    Chi Tiết Đơn Hàng #{order.oid}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Summary Cards Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="border-l-4 border-teal-500 bg-teal-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FaDollarSign className="text-teal-600 text-2xl" />
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Tổng Tiền</p>
                            <h3 className="text-2xl font-bold text-gray-800">${order.total}</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-purple-500 bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FaCreditCard className="text-purple-600 text-2xl" />
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Thanh Toán</p>
                            <h3 className="text-lg font-bold text-gray-800">
                              {order.payment_status?.toLowerCase() === 'paid' ? 'Đã TT' : 'Chưa TT'}
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-blue-500 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FaTruck className="text-blue-600 text-2xl" />
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Trạng Thái</p>
                            <h3 className="text-lg font-bold text-gray-800">
                              {order.order_status === 'Delivered' ? 'Đã Giao' :
                               order.order_status === 'Shipping' ? 'Đang Giao' :
                               order.order_status === 'Processing' ? 'Đang XL' : order.order_status}
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-cyan-500 bg-cyan-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FaMapMarkerAlt className="text-cyan-600 text-2xl" />
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Phí Ship</p>
                            <h3 className="text-2xl font-bold text-gray-800">${order.shipping_amount}</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-sky-500 bg-sky-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FaFileInvoice className="text-sky-600 text-2xl" />
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Thuế</p>
                            <h3 className="text-2xl font-bold text-gray-800">${order.tax_fee}</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-pink-500 bg-pink-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FaTools className="text-pink-600 text-2xl" />
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Phí Dịch Vụ</p>
                            <h3 className="text-2xl font-bold text-gray-800">${order.service_fee}</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-indigo-500 bg-indigo-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FaGift className="text-indigo-600 text-2xl" />
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Giảm Giá</p>
                            <h3 className="text-2xl font-bold text-green-600">-${order.saved}</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Items Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sản Phẩm Trong Đơn Hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100 border-b">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sản Phẩm</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Giá</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SL</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tổng</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Giảm</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thao Tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {orderItems?.map((order, index) => (
                              <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={order?.product?.image}
                                      className="w-20 h-20 object-cover rounded-lg border"
                                      alt={order?.product?.title}
                                    />
                                    <Link 
                                      to={`/detail/${order.product.slug}`} 
                                      className="font-medium text-gray-800 hover:text-[rgb(37,99,235)] transition-colors"
                                    >
                                      {order?.product?.title}
                                    </Link>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="font-semibold text-gray-800">${order.product.price}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge variant="secondary">{order.qty}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-semibold text-gray-800">${order.sub_total}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-semibold text-green-600">-${order.saved}</span>
                                </td>
                                <td className="px-6 py-4">
                                  {order.tracking_id == null || order.tracking_id == 'undefined'
                                    ? <Button size="sm" disabled variant="secondary">
                                        Chưa Có Tracking
                                      </Button>
                                    : <a 
                                        href={`${order.delivery_couriers?.tracking_website}?${order.delivery_couriers?.url_parameter}=${order.tracking_id}`}
                                        target='_blank'
                                        rel="noopener noreferrer"
                                      >
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                          <FaTruck className="mr-2" /> Theo Dõi
                                        </Button>
                                      </a>
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      }

      {loading === true &&
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[rgb(37,99,235)] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tải...</p>
          </div>
        </div>
      }
      <ScrollToTop />
    </div>
  )
}

export default OrderDetail
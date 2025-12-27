import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FaShoppingCart, FaClock, FaCheckCircle, FaEye } from 'react-icons/fa'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

function Orders() {
    const [orders, setOrders] = useState([])

    const axios = apiInstance
    const userData = UserData()
    

    useEffect(() => {
        axios.get(`customer/orders/${userData?.user_id}/`).then((res) => {
            setOrders(res.data)
        })
    }, [])

    console.log(orders);

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
                                    <FaShoppingCart className="inline-block mr-2" />
                                    Đơn Hàng Của Tôi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <Card className="border-l-4 border-teal-500 bg-teal-50">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Tổng Đơn Hàng</p>
                                                    <h2 className="text-3xl font-bold text-gray-800">{orders.length}</h2>
                                                </div>
                                                <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center">
                                                    <FaShoppingCart className="text-white text-2xl" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-purple-500 bg-purple-50">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Chờ Giao Hàng</p>
                                                    <h2 className="text-3xl font-bold text-gray-800">
                                                        {orders.filter(o => o.order_status !== 'Delivered').length}
                                                    </h2>
                                                </div>
                                                <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center">
                                                    <FaClock className="text-white text-2xl" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-blue-500 bg-blue-50">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Đã Hoàn Thành</p>
                                                    <h2 className="text-3xl font-bold text-gray-800">
                                                        {orders.filter(o => o.order_status === 'Delivered').length}
                                                    </h2>
                                                </div>
                                                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <FaCheckCircle className="text-white text-2xl" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Orders Table */}
                                <Card>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-100 border-b">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mã Đơn Hàng</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thanh Toán</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tổng Tiền</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thao Tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {orders.length > 0 ? (
                                                        orders.map((o, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <p className="font-bold text-gray-800">#{o.oid}</p>
                                                                    <p className="text-sm text-gray-500">{moment(o.date).format('DD/MM/YYYY')}</p>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <Badge 
                                                                        className={
                                                                            o.payment_status?.toLowerCase() === 'paid' 
                                                                                ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                                                                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                                                        }
                                                                    >
                                                                        {o.payment_status?.toLowerCase() === 'paid' ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
                                                                    </Badge>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <Badge 
                                                                        className={
                                                                            o.order_status === 'Delivered' 
                                                                                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                                                : o.order_status === 'Shipping'
                                                                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                                                        }
                                                                    >
                                                                        {o.order_status === 'Delivered' ? 'Đã Giao' : 
                                                                         o.order_status === 'Shipping' ? 'Đang Giao' :
                                                                         o.order_status === 'Processing' ? 'Đang Xử Lý' : o.order_status}
                                                                    </Badge>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className="font-semibold text-gray-800">${o.total}</span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <Link to={`/customer/order/detail/${o.oid}/`}>
                                                                        <Button size="sm" className="bg-[rgb(37,99,235)] hover:bg-[rgb(29,78,216)]">
                                                                            <FaEye className="mr-2" /> Xem
                                                                        </Button>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                                <div className="flex flex-col items-center">
                                                                    <FaShoppingCart className="text-gray-300 text-5xl mb-4" />
                                                                    <p className="text-gray-500 text-lg">Chưa có đơn hàng nào</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
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
            <ScrollToTop />
        </div>
    )
}

export default Orders
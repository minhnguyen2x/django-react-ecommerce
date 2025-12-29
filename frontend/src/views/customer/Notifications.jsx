import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FaBell, FaShoppingBag, FaDollarSign, FaTruck, FaFileInvoice, FaTools } from 'react-icons/fa'
import { ScrollToTop } from '@/components/ui/scroll-to-top'


function Notifications() {

    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    const axios = apiInstance
    const userData = UserData()

    useEffect(() => {
        axios.get(`customer/notification/${userData?.user_id}/`).then((res) => {
            setNotifications(res.data);
            if (notifications) {
                setLoading(false)
            }
        })
    }, [])

    console.log(notifications);

    return (
        <div className=" bg-gray-50">
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
                                    <FaBell className="inline-block mr-2" />
                                    Thông Báo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {loading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(37,99,235)]"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {notifications.length > 0 ? (
                                            notifications.map((noti, index) => (
                                                <Card key={index} className="hover:shadow-md transition-all border-l-4 border-[rgb(37,99,235)]">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <FaShoppingBag className="text-green-600 text-xl" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-lg text-gray-800">Đơn Hàng Mới!</h3>
                                                                    <p className="text-sm text-gray-600">
                                                                        Đơn hàng #{noti?.order?.oid} đã được đặt thành công
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {moment(noti.date).format('DD/MM/YYYY')}
                                                            </Badge>
                                                        </div>

                                                        {/* Order Details */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                                                            <div className="flex items-center gap-2">
                                                                <FaDollarSign className="text-[rgb(37,99,235)]" />
                                                                <div>
                                                                    <p className="text-xs text-gray-600">Tổng tiền</p>
                                                                    <p className="font-semibold text-sm">${noti?.order?.total}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <FaTruck className="text-orange-500" />
                                                                <div>
                                                                    <p className="text-xs text-gray-600">Phí ship</p>
                                                                    <p className="font-semibold text-sm">${noti?.order?.shipping_amount}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <FaFileInvoice className="text-purple-500" />
                                                                <div>
                                                                    <p className="text-xs text-gray-600">Thuế</p>
                                                                    <p className="font-semibold text-sm">${noti?.order?.tax_fee}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <FaTools className="text-gray-500" />
                                                                <div>
                                                                    <p className="text-xs text-gray-600">Phí dịch vụ</p>
                                                                    <p className="font-semibold text-sm">${noti?.order?.service_fee}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <FaBell className="text-gray-400 text-4xl" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có thông báo</h3>
                                                <p className="text-gray-500">Bạn chưa có thông báo nào</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <ScrollToTop />
        </div>
    )
}

export default Notifications
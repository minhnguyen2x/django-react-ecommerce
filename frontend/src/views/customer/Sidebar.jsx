import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import UseProfileData from '../plugin/UseProfileData'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FaUser, FaShoppingCart, FaBell, FaCog, FaSignOutAlt, FaEdit } from 'react-icons/fa'


function Sidebar() {

    const userProfile = UseProfileData()
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userProfile) {
            setLoading(false)
        }

    })

    return (
        <div className="space-y-4">
            {loading === false &&
                <>
                    {/* Profile Card */}
                    <Card className="shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <img
                                        src={userProfile?.image}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-[rgb(37,99,235)] shadow-lg"
                                        alt={userProfile?.full_name}
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{userProfile?.full_name}</h3>
                                <Link 
                                    to="/customer/settings/" 
                                    className="text-[rgb(37,99,235)] hover:text-[rgb(29,78,216)] flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <FaEdit /> Chỉnh Sửa Tài Khoản
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation Menu */}
                    <Card className="shadow-lg">
                        <CardContent className="p-2">
                            <nav className="space-y-1">
                                <Link 
                                    to='/customer/account/' 
                                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaUser className="text-[rgb(37,99,235)] group-hover:scale-110 transition-transform" />
                                        <span className="font-medium text-gray-700 group-hover:text-[rgb(37,99,235)]">Tài Khoản</span>
                                    </div>
                                </Link>

                                <Link 
                                    to='/customer/orders/' 
                                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaShoppingCart className="text-[rgb(37,99,235)] group-hover:scale-110 transition-transform" />
                                        <span className="font-medium text-gray-700 group-hover:text-[rgb(37,99,235)]">Đơn Hàng</span>
                                    </div>
                                </Link>

                                <Link 
                                    to='/customer/notifications/' 
                                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaBell className="text-yellow-500 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium text-gray-700 group-hover:text-[rgb(37,99,235)]">Thông Báo</span>
                                    </div>
                                </Link>

                                <Link 
                                    to='/customer/settings/' 
                                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaCog className="text-gray-600 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium text-gray-700 group-hover:text-[rgb(37,99,235)]">Cài Đặt</span>
                                    </div>
                                </Link>

                                <div className="border-t border-gray-200 my-2"></div>

                                <Link 
                                    to="/logout" 
                                    className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-red-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaSignOutAlt className="text-red-500 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium text-red-600 group-hover:text-red-700">Đăng Xuất</span>
                                    </div>
                                </Link>
                            </nav>
                        </CardContent>
                    </Card>
                </>
            }
        </div>
    )
}

export default Sidebar
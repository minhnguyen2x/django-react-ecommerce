import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { addToWishlist } from '../plugin/addToWishlist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FaHeart, FaShoppingCart } from 'react-icons/fa'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

function Wishlist() {
    const [wishlist, setWishlist] = useState([])

    const axios = apiInstance
    const userData = UserData()


    const fetchWishlist = async () => {
        try {
            const response = await axios.get(`customer/wishlist/${userData?.user_id}/`);
            setWishlist(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [userData?.user_id]);

    console.log(wishlist);

    const handleAddToWishlist = async (product_id) => {
        try {
            await addToWishlist(product_id, userData?.user_id)
            fetchWishlist()

        } catch (error) {
            console.log(error);
        }
    };

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
                                    <FaHeart className="inline-block mr-2" />
                                    Danh Sách Yêu Thích
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {wishlist.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {wishlist.map((w, index) => (
                                            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all">
                                                <div className="relative group">
                                                    <img
                                                        src={w.product.image}
                                                        className="w-full aspect-square object-cover"
                                                        alt={w.product.title}
                                                    />
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className="bg-[rgb(37,99,235)] hover:bg-[rgb(29,78,216)]">
                                                            Mới
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <CardContent className="p-4">
                                                    <Link to={`/detail/${w.product.slug}`} className="text-gray-800 hover:text-[rgb(37,99,235)] transition-colors">
                                                        <h6 className="font-semibold text-base mb-2 line-clamp-2">
                                                            {w.product.title}
                                                        </h6>
                                                    </Link>
                                                    <p className="text-sm text-gray-600 mb-2">{w.product?.brand?.title}</p>
                                                    <div className="flex items-center justify-between mt-4">
                                                        <h6 className="text-xl font-bold text-[rgb(37,99,235)]">${w.product.price}</h6>
                                                        <Button 
                                                            onClick={() => handleAddToWishlist(w.product.id)} 
                                                            size="sm"
                                                            className="bg-red-500 hover:bg-red-600 text-white"
                                                        >
                                                            <FaHeart className="mr-2" /> Xóa
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FaHeart className="text-gray-400 text-5xl" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Danh sách yêu thích trống</h3>
                                        <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm yêu thích nào</p>
                                        <Link to="/">
                                            <Button className="bg-[rgb(37,99,235)] hover:bg-[rgb(29,78,216)]">
                                                <FaShoppingCart className="mr-2" /> Tiếp Tục Mua Sắm
                                            </Button>
                                        </Link>
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

export default Wishlist
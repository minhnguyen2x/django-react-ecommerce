import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import UseProfileData from '../plugin/UseProfileData';
import Swal from 'sweetalert2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FaCog, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaImage } from 'react-icons/fa'
import { ScrollToTop } from '@/components/ui/scroll-to-top'


function Settings() {
    const [profileData, setProfileData] = useState({
        'full_name': '',
        'mobile': '',
        'email': '',
        'about': '',
        'country': '',
        'city': '',
        'state': '',
        'address': '',
        'p_image': '',
    });
    const [loading, setLoading] = useState(false)
    

    const axios = apiInstance
    const userData = UserData()

    useEffect(() => {
        // Fetch existing profile data
        const fetchProfileData = async () => {
            try {
                axios.get(`user/profile/${userData?.user_id}/`).then((res) => {
                    // setProfileData(res.data);
                    setProfileData({
                        'full_name': res.data?.full_name,
                        'email': res.data.user.email,
                        'phone': res.data.user.phone,
                        'about': res.data.about,
                        'country': res.data.country,
                        'city': res.data.city,
                        'state': res.data.state,
                        'address': res.data.address,
                        'p_image': res.data.image,
                    })
                })
            } catch (error) {
                console.error('Error fetching profile data: ', error);
            }
        };

        fetchProfileData();
    }, []);


    const handleInputChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value
        })
    };

    const handleFileChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.files[0]
        })
    }


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const res = await axios.get(`user/profile/${userData?.user_id}/`);

        const formData = new FormData();
        if (profileData.p_image && profileData.p_image !== res.data.image) {
            formData.append('image', profileData.p_image);
        }
        formData.append('full_name', profileData.full_name);
        formData.append('about', profileData.about);
        formData.append('country', profileData.country);
        formData.append('city', profileData.city);
        formData.append('state', profileData.state);
        formData.append('address', profileData.address);

        try {
            await apiInstance.patch(`customer/setting/${userData?.user_id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            Swal.fire({
                icon: 'success',
                title: "Profile updated successfully",
            })
            setLoading(false)

        } catch (error) {
            console.error('Error updating profile:', error);
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
                                    <FaCog className="inline-block mr-2" />
                                    Cài Đặt Tài Khoản
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleFormSubmit} method='POST' encType="multipart/form-data">
                                    <div className="space-y-6">
                                        {/* Profile Image */}
                                        <div className="space-y-2">
                                            <Label htmlFor="p_image" className="flex items-center gap-2 text-sm font-medium">
                                                <FaImage className="text-[rgb(37,99,235)]" />
                                                Ảnh Đại Diện
                                            </Label>
                                            <Input
                                                id="p_image"
                                                type="file"
                                                onChange={handleFileChange}
                                                name='p_image'
                                                className="cursor-pointer"
                                                accept="image/*"
                                            />
                                        </div>

                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="full_name" className="flex items-center gap-2 text-sm font-medium">
                                                <FaUser className="text-[rgb(37,99,235)]" />
                                                Họ và Tên
                                            </Label>
                                            <Input
                                                id="full_name"
                                                type="text"
                                                value={profileData?.full_name}
                                                onChange={handleInputChange}
                                                name='full_name'
                                                placeholder="Nhập họ và tên"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Email */}
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                                    <FaEnvelope className="text-[rgb(37,99,235)]" />
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileData?.email}
                                                    name='email'
                                                    readOnly
                                                    className="bg-gray-100"
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                                                    <FaPhone className="text-[rgb(37,99,235)]" />
                                                    Số Điện Thoại
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="text"
                                                    value={profileData?.phone}
                                                    name='phone'
                                                    readOnly
                                                    className="bg-gray-100"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Address */}
                                            <div className="space-y-2">
                                                <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                                                    <FaMapMarkerAlt className="text-[rgb(37,99,235)]" />
                                                    Địa Chỉ
                                                </Label>
                                                <Input
                                                    id="address"
                                                    name='address'
                                                    value={profileData?.address}
                                                    type="text"
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập địa chỉ"
                                                />
                                            </div>

                                            {/* City */}
                                            <div className="space-y-2">
                                                <Label htmlFor="city" className="flex items-center gap-2 text-sm font-medium">
                                                    <FaCity className="text-[rgb(37,99,235)]" />
                                                    Thành Phố
                                                </Label>
                                                <Input
                                                    id="city"
                                                    type="text"
                                                    value={profileData?.city}
                                                    name='city'
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập thành phố"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* State */}
                                            <div className="space-y-2">
                                                <Label htmlFor="state" className="flex items-center gap-2 text-sm font-medium">
                                                    <FaMapMarkerAlt className="text-[rgb(37,99,235)]" />
                                                    Tỉnh/Quận
                                                </Label>
                                                <Input
                                                    id="state"
                                                    type="text"
                                                    value={profileData?.state}
                                                    name='state'
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập tỉnh/quận"
                                                />
                                            </div>

                                            {/* Country */}
                                            <div className="space-y-2">
                                                <Label htmlFor="country" className="flex items-center gap-2 text-sm font-medium">
                                                    <FaGlobe className="text-[rgb(37,99,235)]" />
                                                    Quốc Gia
                                                </Label>
                                                <Input
                                                    id="country"
                                                    type="text"
                                                    value={profileData?.country}
                                                    name='country'
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập quốc gia"
                                                />
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-4">
                                            {loading === false &&
                                                <Button 
                                                    type="submit" 
                                                    className="w-full md:w-auto bg-[rgb(37,99,235)] hover:bg-[rgb(29,78,216)] text-white px-8"
                                                >
                                                    Lưu Thay Đổi
                                                </Button>
                                            }

                                            {loading === true &&
                                                <Button 
                                                    disabled 
                                                    className="w-full md:w-auto bg-[rgb(37,99,235)] px-8"
                                                >
                                                    Đang Lưu... <span className="ml-2 animate-spin">⟳</span>
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <ScrollToTop />
        </div>
    )
}

export default Settings
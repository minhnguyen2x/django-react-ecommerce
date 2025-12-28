import React, { useEffect, useState } from 'react'
import { CheckCircle2, Store, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import Sidebar from './Sidebar'


function Settings() {
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    email: '',
    about: '',
    country: '',
    city: '',
    state: '',
    address: '',
    p_image: '',
  })
  const [vendorData, setVendorData] = useState({
    name: '',
    description: '',
    mobile: '',
    slug: '',
    image: '',
  })
  const [vendorImage, setVendorImage] = useState('')
  const [profileImage, setProfileImage] = useState('')

  const axios = apiInstance
  const userData = UserData()

  if (userData?.vendor_id === 0) {
    window.location.href = '/vendor/register/'
  }

  const fetchProfileData = async () => {
    try {
      const res = await axios.get(`vendor-settings/${userData?.user_id}/`)
      setProfileData({
        full_name: res.data?.full_name || '',
        email: res.data?.user?.email || '',
        phone: res.data?.user?.phone || '',
        about: res.data?.about || '',
        country: res.data?.country || '',
        city: res.data?.city || '',
        state: res.data?.state || '',
        address: res.data?.address || '',
        p_image: res.data?.image || '',
      })
      setProfileImage(res.data?.image || '')
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }

  const fetchVendorData = async () => {
    try {
      const res = await axios.get(`vendor-shop-settings/${userData?.vendor_id}/`)
      setVendorData({
        name: res.data?.name || '',
        description: res.data?.description || '',
        mobile: res.data?.mobile || '',
        slug: res.data?.slug || '',
        image: res.data?.image || '',
      })
      setVendorImage(res.data?.image || '')
    } catch (error) {
      console.error('Error fetching vendor data:', error)
    }
  }

  useEffect(() => {
    fetchProfileData()
    fetchVendorData()
  }, [])

  const handleInputChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    })
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setProfileData({
      ...profileData,
      [event.target.name]: file,
    })
    setProfileImage(URL.createObjectURL(file))
  }

  const handleShopInputChange = (event) => {
    setVendorData({
      ...vendorData,
      [event.target.name]: event.target.value,
    })
  }

  const handleShopFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setVendorData({
      ...vendorData,
      [event.target.name]: file,
    })
    setVendorImage(URL.createObjectURL(file))
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    if (profileData.p_image && typeof profileData.p_image !== 'string') {
      formData.append('image', profileData.p_image)
    }
    formData.append('full_name', profileData.full_name)
    formData.append('about', profileData.about)
    formData.append('country', profileData.country)
    formData.append('city', profileData.city)
    formData.append('state', profileData.state)
    formData.append('address', profileData.address)

    try {
      await apiInstance.patch(`vendor-settings/${userData?.user_id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      await fetchProfileData()
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật hồ sơ thành công',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      Swal.fire({
        icon: 'error',
        title: 'Không thể cập nhật hồ sơ',
      })
    }
  }

  const handleShopFormSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    if (vendorData.image && typeof vendorData.image !== 'string') {
      formData.append('image', vendorData.image)
    }
    formData.append('name', vendorData.name)
    formData.append('description', vendorData.description)
    formData.append('mobile', vendorData.mobile)

    try {
      await apiInstance.patch(`vendor-shop-settings/${userData?.vendor_id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      await fetchVendorData()
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật cửa hàng thành công',
      })
    } catch (error) {
      console.error('Error updating shop:', error)
      Swal.fire({
        icon: 'error',
        title: 'Không thể cập nhật cửa hàng',
      })
    }
  }

  const profilePreview = profileImage || 'https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca.gif'
  const vendorPreview = vendorImage || 'https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca.gif'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row">
        <Sidebar />
        <div className="flex-1 space-y-8">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900">Cài Đặt</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý giao diện cửa hàng và thông tin hồ sơ cá nhân của bạn.
            </p>
          </header>

          <Tabs defaultValue="shop" className="space-y-6">
            <TabsList>
              <TabsTrigger value="shop">Cài Đặt Cửa Hàng</TabsTrigger>
              <TabsTrigger value="profile">Hồ Sơ</TabsTrigger>
            </TabsList>

            <TabsContent value="shop" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      Tổng Quan Cửa Hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="h-40 w-40 overflow-hidden rounded-full border border-slate-200 bg-white">
                      <img
                        src={vendorPreview}
                        alt={`${vendorData.name || 'Cửa hàng'} avatar`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-slate-900">{vendorData.name || 'Tên cửa hàng của bạn'}</p>
                      <p className="text-sm text-muted-foreground">
                        {vendorData.description || 'Thêm mô tả ngắn để giới thiệu cửa hàng của bạn.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      Cập nhật thông tin cửa hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-5" onSubmit={handleShopFormSubmit} encType="multipart/form-data">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="shop-image">Ảnh Đại Diện Cửa Hàng</Label>
                          <Input id="shop-image" type="file" name="image" onChange={handleShopFileChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shop-name">Tên Cửa Hàng</Label>
                          <Input
                            id="shop-name"
                            type="text"
                            name="name"
                            value={vendorData.name}
                            onChange={handleShopInputChange}
                            placeholder="Cửa hàng tuyệt vời của tôi"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shop-description">Mô Tả Cửa Hàng</Label>
                        <Textarea
                          id="shop-description"
                          name="description"
                          value={vendorData.description}
                          onChange={handleShopInputChange}
                          placeholder="Mô tả dải sản phẩm, bảo hành và chính sách dịch vụ của bạn."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shop-mobile">Số Điện Thoại</Label>
                        <Input
                          id="shop-mobile"
                          type="text"
                          name="mobile"
                          value={vendorData.mobile}
                          onChange={handleShopInputChange}
                          placeholder="+84 123 456 789"
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button type="submit" className="w-full sm:w-auto">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Cập Nhật Cửa Hàng
                        </Button>
                        {vendorData.slug && (
                          <Button asChild variant="outline" className="w-full sm:w-auto">
                            <Link to={`/vendor/${vendorData.slug}/`}>
                              <Store className="mr-2 h-4 w-4" />
                              Xem Cửa Hàng
                            </Link>
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg font-semibold text-slate-900">Tổng Quan Hồ Sơ</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="h-40 w-40 overflow-hidden rounded-full border border-slate-200 bg-white">
                      <img
                        src={profilePreview}
                        alt={`${profileData.full_name || 'Hồ sơ'} avatar`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-slate-900">{profileData.full_name || 'Tên của bạn'}</p>
                      <p className="text-sm text-muted-foreground">
                        {profileData.about || 'Chia sẻ với khách hàng về bản thân và chuyên môn của bạn.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900">Cập nhật thông tin hồ sơ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-5" onSubmit={handleFormSubmit} encType="multipart/form-data">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="profile-image">Ảnh Hồ Sơ</Label>
                          <Input id="profile-image" type="file" name="p_image" onChange={handleFileChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profile-name">Họ Tên</Label>
                          <Input
                            id="profile-name"
                            type="text"
                            name="full_name"
                            value={profileData.full_name}
                            onChange={handleInputChange}
                            placeholder="Nguyễn Văn A"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="profile-about">Giới Thiệu</Label>
                          <Textarea
                            id="profile-about"
                            name="about"
                            value={profileData.about}
                            onChange={handleInputChange}
                            placeholder="Chia sẻ tiểu sử ngắn về thương hiệu, sứ mệnh và chất lượng dịch vụ."
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profile-country">Quốc Gia</Label>
                          <Input
                            id="profile-country"
                            type="text"
                            name="country"
                            value={profileData.country}
                            onChange={handleInputChange}
                            placeholder="Việt Nam"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="profile-city">Thành Phố</Label>
                          <Input
                            id="profile-city"
                            type="text"
                            name="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            placeholder="Thành phố Hồ Chí Minh"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profile-state">Quận / Huyện</Label>
                          <Input
                            id="profile-state"
                            type="text"
                            name="state"
                            value={profileData.state}
                            onChange={handleInputChange}
                            placeholder="Quận 1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profile-address">Địa Chỉ</Label>
                        <Input
                          id="profile-address"
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          placeholder="123 Nguyễn Huệ, Bến Nghé"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="profile-email">Email</Label>
                          <Input id="profile-email" type="email" value={profileData.email} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profile-phone">Mobile</Label>
                          <Input id="profile-phone" type="text" value={profileData.phone} disabled />
                        </div>
                      </div>

                      <Button type="submit" className="w-full sm:w-auto">
                        <User className="mr-2 h-4 w-4" />
                        Cập Nhật Hồ Sơ
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Settings
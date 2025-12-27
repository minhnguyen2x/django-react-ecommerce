import React, { useState } from 'react'
import { Loader2, Store } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'

function VendorRegister() {

    if (UserData()?.vendor_id !== 0) {
        window.location.href = '/vendor/dashboard/'
    }

    const [vendor, setVendor] = useState({
        image: null,
        name: "",
        email: "",
        description: "",
        mobile: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleInputChange = (event) => {
        setVendor({
            ...vendor,
            [event.target.name]: event.target.value
        })
    }

    const handleFileChange = (event) => {
        setVendor({
            ...vendor,
            [event.target.name]: event.target.files?.[0] || null
        })
    }

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData()
        setIsLoading(true)

        formdata.append('image', vendor.image)
        formdata.append('name', vendor.name)
        formdata.append('email', vendor.email)
        formdata.append('description', vendor.description)
        formdata.append('mobile', vendor.mobile)
        formdata.append('user_id', UserData()?.user_id)

        await apiInstance.post(`vendor-register/`, formdata, config).then((res) => {
            console.log(res.data.message);
            if (res.data.message == "Created vendor account") {
                Swal.fire({
                    icon: "success",
                    title: "Vendor Account Created Successfully",
                    text: "Login to continue to dashboard",
                })
                setIsLoading(false)
                navigate('/logout')
            }
        })
    }

    return (
        <main className="min-h-[calc(100vh-120px)] bg-slate-50 py-12">
            <div className="mx-auto w-full max-w-3xl px-4">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="space-y-2 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Store className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl font-semibold">
                            Register Vendor Account
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Create your shop profile so you can start managing products and orders.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="vendor-image">Shop Avatar</Label>
                                <Input
                                    id="vendor-image"
                                    type="file"
                                    onChange={handleFileChange}
                                    name="image"
                                    required
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="vendor-name">Shop Name</Label>
                                    <Input
                                        id="vendor-name"
                                        type="text"
                                        onChange={handleInputChange}
                                        name="name"
                                        placeholder="Awesome Store"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vendor-email">Shop Email Address</Label>
                                    <Input
                                        id="vendor-email"
                                        type="email"
                                        onChange={handleInputChange}
                                        name="email"
                                        placeholder="shop@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vendor-phone">Shop Contact Number</Label>
                                <Input
                                    id="vendor-phone"
                                    type="tel"
                                    onChange={handleInputChange}
                                    name="mobile"
                                    placeholder="+84 123 456 789"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vendor-description">Shop Description</Label>
                                <Textarea
                                    id="vendor-description"
                                    onChange={handleInputChange}
                                    name="description"
                                    placeholder="Tell customers about your brand, products, and service guarantees."
                                    rows={5}
                                />
                            </div>

                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Store className="mr-2 h-4 w-4" />
                                        Create Shop
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

export default VendorRegister
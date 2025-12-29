import React, { useEffect, useState } from 'react'
import { ArrowLeft, BadgePercent, CheckCircle2, Tag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import Sidebar from './Sidebar'
import Swal from 'sweetalert2'

function EditCoupon() {
    const [coupon, setCoupon] = useState({
        code: '',
        discount: '',
        active: false,
    })
    const [loading, setLoading] = useState(false)

    const axios = apiInstance
    const userData = UserData()
    const param = useParams()

    if (userData?.vendor_id === 0) {
        window.location.href = '/vendor/register/'
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(`vendor-coupon-detail/${userData?.vendor_id}/${param.id}`)
            setCoupon({
                code: res.data?.code || '',
                discount: res.data?.discount ?? '',
                active: Boolean(res.data?.active),
            })
        } catch (error) {
            console.error('Error fetching coupon:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleUpdateCouponChange = (name, value) => {
        setCoupon((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleUpdateCoupon = async (event) => {
        event.preventDefault()
        setLoading(true)

        const formdata = new FormData()
        formdata.append('vendor', userData?.vendor_id)
        formdata.append('code', coupon.code)
        formdata.append('discount', coupon.discount)
        formdata.append('active', coupon.active)

        try {
            await axios.patch(`vendor-coupon-detail/${userData?.vendor_id}/${param.id}/`, formdata)
            Swal.fire({
                icon: 'success',
                title: 'Coupon updated',
            })
        } catch (error) {
            console.error('Error updating coupon:', error)
            Swal.fire({
                icon: 'error',
                title: 'Unable to update coupon',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className=" bg-slate-50">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row">
                <Sidebar />
                <div className="flex-1 space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold text-slate-900">Edit coupon</h1>
                            <p className="text-sm text-muted-foreground">Update codes and offers for your storefront promotions.</p>
                        </div>
                        <Button asChild variant="ghost" className="text-slate-600">
                            <Link to="/vendor/coupon/">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to coupons
                            </Link>
                        </Button>
                    </div>

                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                <Tag className="h-5 w-5 text-slate-500" /> Coupon details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6" onSubmit={handleUpdateCoupon}>
                                <div className="space-y-2">
                                    <Label htmlFor="code">Coupon code</Label>
                                    <Input
                                        id="code"
                                        name="code"
                                        value={coupon.code}
                                        onChange={(event) => handleUpdateCouponChange(event.target.name, event.target.value.toUpperCase())}
                                        placeholder="SUMMER2026"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">Codes are not case sensitive when shoppers redeem them.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discount" className="flex items-center gap-2">
                                        Discount (%)
                                        <BadgePercent className="h-4 w-4 text-slate-400" />
                                    </Label>
                                    <Input
                                        id="discount"
                                        name="discount"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={coupon.discount}
                                        onChange={(event) => handleUpdateCouponChange(event.target.name, event.target.value)}
                                        placeholder="15"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">Enter the percentage discount shoppers receive when applying this code.</p>
                                </div>

                                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-800">Activate coupon</p>
                                        <p className="text-xs text-muted-foreground">Toggle off to save the code for later without publishing it.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Label htmlFor="active" className="text-sm text-slate-700">
                                            {coupon.active ? 'Active' : 'Inactive'}
                                        </Label>
                                        <Switch
                                            id="active"
                                            checked={coupon.active}
                                            onCheckedChange={(checked) => handleUpdateCouponChange('active', Boolean(checked))}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <Button type="submit" disabled={loading}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        {loading ? 'Saving…' : 'Update coupon'}
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link to="/vendor/coupon/">
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs text-muted-foreground">
                                Need to remove this coupon instead? Delete it from the coupon list to prevent further use.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default EditCoupon
import React, { useEffect, useState } from 'react'
import { ArrowLeft, PackageSearch, Send, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import Sidebar from './Sidebar'
import Swal from 'sweetalert2'

function OrderItemDetail() {
    const [orderItems, setOrderItems] = useState(null)
    const [order, setOrder] = useState(null)
    const [courier, setCourier] = useState([])
    const [trackingData, setTrackingData] = useState({
        delivery_couriers: '',
        tracking_id: '',
        notify_buyer: false,
    })
    const [loading, setLoading] = useState(false)

    const axios = apiInstance
    const userData = UserData()
    const param = useParams()

    if (userData?.vendor_id === 0) {
        window.location.href = '/vendor/register/'
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`vendor/order-item-detail/${param.id}/`)
                setOrder(response.data?.order || null)
                setOrderItems(response.data || null)

                const deliveryCourierRaw = response.data?.delivery_couriers
                const deliveryCourierId =
                    deliveryCourierRaw && typeof deliveryCourierRaw === 'object'
                        ? deliveryCourierRaw.id
                        : deliveryCourierRaw

                setTrackingData({
                    delivery_couriers: deliveryCourierId ? String(deliveryCourierId) : '',
                    tracking_id: response.data?.tracking_id || '',
                    notify_buyer: Boolean(response.data?.notify_buyer),
                })
            } catch (error) {
                console.error('Error fetching order detail:', error)
            }
        }

        const fetchCourier = async () => {
            try {
                const response = await axios.get(`vendor/couriers/`)
                setCourier(response.data || [])
            } catch (error) {
                console.error('Error fetching courier list:', error)
            }
        }

        fetchCourier()
        fetchData()
    }, [])

    const updateTrackingData = (name, value) => {
        setTrackingData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleOnSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        const formdata = new FormData()
        if (trackingData.tracking_id) {
            formdata.append('tracking_id', trackingData.tracking_id)
        }
        if (trackingData.delivery_couriers) {
            formdata.append('delivery_couriers', trackingData.delivery_couriers)
        }
        formdata.append('notify_buyer', trackingData.notify_buyer)

        try {
            await axios.patch(`vendor/order-item-detail/${param.id}/`, formdata)
            Swal.fire({
                icon: 'success',
                title: 'Tracking details saved',
            })
        } catch (error) {
            console.error('Error updating tracking info:', error)
            Swal.fire({
                icon: 'error',
                title: 'Unable to update tracking info',
            })
        } finally {
            setLoading(false)
        }
    }

    const courierOptions = courier
        .filter((c) => c?.id != null)
        .map((c) => ({ id: String(c.id), name: c?.name || 'Unnamed courier' }))

    return (
        <div className=" bg-slate-50">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row">
                <Sidebar />
                <div className="flex-1 space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold text-slate-900">Order tracking</h1>
                            <p className="text-sm text-muted-foreground">Assign courier details and keep your customer informed.</p>
                        </div>
                        <Button asChild variant="ghost" className="text-slate-600">
                            <Link to={`/vendor/orders/${order?.oid || ''}/`}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to order
                            </Link>
                        </Button>
                    </div>

                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                <PackageSearch className="h-5 w-5 text-slate-500" /> Order #{order?.oid || '—'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6" onSubmit={handleOnSubmit}>
                                <div className="space-y-2">
                                    <Label htmlFor="delivery_couriers" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Truck className="h-4 w-4 text-slate-500" /> Delivery courier
                                    </Label>
                                    <Select
                                        value={trackingData.delivery_couriers?.toString() || ''}
                                        onValueChange={(value) => updateTrackingData('delivery_couriers', value)}
                                    >
                                        <SelectTrigger id="delivery_couriers">
                                            <SelectValue placeholder="Select delivery courier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {courierOptions.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Can’t find your courier? <a href="mailto:support@example.com" className="font-medium text-primary">Contact us</a> and we’ll help set it up.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tracking_id" className="text-sm font-medium text-slate-700">
                                        Tracking ID
                                    </Label>
                                    <Input
                                        id="tracking_id"
                                        name="tracking_id"
                                        value={trackingData.tracking_id}
                                        onChange={(event) => updateTrackingData(event.target.name, event.target.value)}
                                        placeholder={orderItems?.tracking_id || 'Add tracking ID'}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="notify_buyer"
                                        checked={trackingData.notify_buyer}
                                        onCheckedChange={(checked) => updateTrackingData('notify_buyer', Boolean(checked))}
                                    />
                                    <Label htmlFor="notify_buyer" className="text-sm text-slate-700">
                                        Notify buyer about tracking updates
                                    </Label>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <Button type="submit" disabled={loading}>
                                        <Send className="mr-2 h-4 w-4" />
                                        {loading ? 'Saving…' : 'Save tracking info'}
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link to={`/vendor/orders/${order?.oid || ''}/`}>
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default OrderItemDetail
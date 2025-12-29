import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Clock, Download, Eye, Home } from 'lucide-react'

import apiInstance from '../../utils/axios'
import Addon from '../plugin/Addon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

function PaymentSuccess() {
    const [isLoading, setIsLoading] = useState(true)
    const [orderResponse, setOrderResponse] = useState(null)
    const [order, setOrder] = useState(null)

    const addon = Addon()
    const currencySign = addon?.currency_sign || '$'

    const axios = apiInstance
    const params = useParams()

    const urlParams = useMemo(() => new URLSearchParams(window.location.search), [])
    const sessionId = urlParams.get('session_id')
    const payaplOrderId = urlParams.get('payapl_order_id')
    const paymentMethod = urlParams.get('payment_method')

    useEffect(() => {
        if (!params?.order_oid) {
            return
        }

        const fetchOrder = async () => {
            try {
                const response = await axios.get(`checkout/${params.order_oid}/`)
                setOrder(response.data)
            } catch (error) {
                console.error('Error fetching order detail:', error)
            }
        }

        fetchOrder()
    }, [axios, params?.order_oid])

    useEffect(() => {
        if (!params?.order_oid) {
            return
        }

        const processPayment = async () => {
            const formData = new FormData()
            formData.append('order_oid', params.order_oid)
            formData.append('session_id', sessionId)
            formData.append('payapl_order_id', payaplOrderId)
            formData.append('payment_method', paymentMethod || 'null')

            try {
                setIsLoading(true)
                const response = await axios.post('payment-success/', formData)
                setOrderResponse(response.data)
            } catch (error) {
                console.error('Error processing payment:', error)
                setOrderResponse({ message: 'Payment Error' })
            } finally {
                setIsLoading(false)
            }
        }

        processPayment()
    }, [axios, params?.order_oid, payaplOrderId, sessionId])

    const formatCurrency = (value) => {
        if (value === null || value === undefined || Number.isNaN(Number(value))) {
            return `${currencySign}0`
        }

        return `${currencySign}${Number(value).toLocaleString()}`
    }

    const summaryRows = useMemo(
        () => [
            { label: 'Subtotal', value: formatCurrency(order?.sub_total) },
            { label: 'Shipping Fee', value: formatCurrency(order?.shipping_amount) },
            { label: 'Service Fee', value: formatCurrency(order?.service_fee) },
            { label: 'Tax', value: formatCurrency(order?.tax_fee) },
            { label: 'Discount', value: `-${formatCurrency(order?.saved)}` }
        ],
        [order, currencySign]
    )

    const totalValue = formatCurrency(order?.total)
    const statusMessage = orderResponse?.message

    const renderStatus = () => {
        if (isLoading) {
            return (
                <Card className="border-0 shadow-sm">
                    <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                        <Clock className="h-16 w-16 text-amber-500" />
                        <div className="space-y-2">
                            <CardTitle className="text-2xl">Đang Xử Lý...</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Chúng tôi đang xác minh thanh toán của bạn, vui lòng đợi trong giây lát.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        if (statusMessage === 'Payment Successfull' || statusMessage === 'Already Paid') {
            const isFirstPayment = statusMessage === 'Payment Successfull'

            return (
                <Card className="border-0 shadow-sm">
                    <CardContent className="space-y-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                            <div className="space-y-2">
                                <CardTitle className="text-2xl">
                                    {isFirstPayment ? 'Cảm Ơn Bạn!' : 'Đã Thanh Toán'}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {isFirstPayment
                                        ? 
                                        'Bạn đã đặt hàng thành công.'
                                        : 'Bạn đã thanh toán cho đơn hàng này trước đó. Cảm ơn bạn đã tiếp tục đồng hành.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="gap-2" variant="secondary">
                                        <Eye className="h-4 w-4" />
                                        Xem Đơn Hàng
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg bg-white">
                                    <DialogHeader>
                                        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="font-medium text-slate-900">{order?.full_name}</p>
                                            <p className="text-muted-foreground">{order?.email}</p>
                                            <p className="text-muted-foreground">{order?.address}</p>
                                        </div>
                                        <Separator />
                                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Tóm tắt thanh toán
                                        </p>
                                        <div className="space-y-2">
                                            {summaryRows.map((row) => (
                                                <div key={row.label} className="flex items-start justify-between text-sm">
                                                    <span className="text-muted-foreground">{row.label}</span>
                                                    <span className="font-medium text-slate-900">{row.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-900">Tổng</span>
                                            <span className="text-lg font-semibold text-primary">{totalValue}</span>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {order?.oid && (
                                <Button asChild className="gap-2">
                                    <Link to={`/invoice/${order.oid}/`}>
                                        <Download className="h-4 w-4" />
                                        Tải Hóa Đơn
                                    </Link>
                                </Button>
                            )}

                            <Button asChild variant="outline" className="gap-2">
                                <Link to="/">
                                    <Home className="h-4 w-4" />
                                    Về Trang Chủ
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card className="border-0 shadow-sm">
                <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                    <Clock className="h-16 w-16 text-amber-500" />
                    <div className="space-y-2">
                        <CardTitle className="text-2xl">Không thể xác minh thanh toán</CardTitle>
                        <p className="text-sm text-muted-foreground">Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.</p>
                    </div>
                    <Button asChild>
                        <Link to="/">Quay về trang chủ</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className=" bg-white">
            <ScrollToTop />
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-slate-900">Trạng thái thanh toán</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Mã đơn hàng: <span className="font-medium text-slate-900">{params?.order_oid}</span>
                    </p>
                </div>
                {renderStatus()}
            </div>
        </div>
    )
}

export default PaymentSuccess

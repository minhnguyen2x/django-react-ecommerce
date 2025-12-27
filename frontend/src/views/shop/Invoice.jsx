import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Mail, MapPin, Phone, Printer, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollToTop } from '@/components/ui/scroll-to-top'
import { Separator } from '@/components/ui/separator'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

import apiInstance from '../../utils/axios'

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

function Invoice() {
    const [order, setOrder] = useState(null)
    const [orderItems, setOrderItems] = useState([])
    const [loading, setLoading] = useState(true)

    const axios = apiInstance
    const { order_oid: orderId } = useParams()

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!orderId) {
                setLoading(false)
                return
            }

            try {
                const response = await axios.get(`checkout/${orderId}/`)
                setOrder(response.data)
                setOrderItems(response.data?.orderitem || [])
            } catch (error) {
                console.error('Error fetching invoice data:', error)
                setOrder(null)
                setOrderItems([])
            } finally {
                setLoading(false)
            }
        }

        fetchInvoice()
    }, [axios, orderId])

    const handlePrint = () => {
        window.print()
    }

    const totals = useMemo(() => ({
        subTotal: order?.sub_total || 0,
        shipping: order?.shipping_amount || 0,
        tax: order?.tax_fee || 0,
        serviceFee: order?.service_fee || 0,
        total: order?.total || 0
    }), [order])

    return (
        <div className="min-h-screen bg-slate-50">
            <ScrollToTop />
            <div className="mx-auto w-full max-w-4xl px-4 py-10">
                {loading ? (
                    <Card className="shadow-sm">
                        <CardContent className="space-y-4 py-12 text-center">
                            <p className="text-sm text-muted-foreground">Đang tải hóa đơn…</p>
                        </CardContent>
                    </Card>
                ) : !order ? (
                    <Card className="shadow-sm">
                        <CardContent className="space-y-4 py-12 text-center">
                            <p className="text-lg font-medium text-slate-900">Không tìm thấy hóa đơn</p>
                            <p className="text-sm text-muted-foreground">Vui lòng kiểm tra lại mã đơn hàng của bạn.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    alt="Brand logo"
                                    src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                                <div>
                                    <CardTitle className="text-2xl font-semibold">
                                        Desphixs<span className="text-primary">.</span>
                                    </CardTitle>
                                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                        <p className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" /> +1 3649-6589
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" /> company@gmail.com
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" /> 123 Main Street
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <p className="flex items-center gap-2 text-slate-500">
                                    <User className="h-4 w-4" /> Khách hàng
                                </p>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="font-semibold text-slate-900">{order.full_name}</p>
                                    <p className="text-sm text-muted-foreground">{order.email}</p>
                                    <p className="text-sm text-muted-foreground">{order.mobile}</p>
                                    <Separator className="my-3" />
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Hóa đơn</p>
                                    <p className="text-sm font-semibold text-slate-900">#{order.oid}</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8">
                            <div className="overflow-hidden rounded-lg border">
                                <Table>
                                    <TableHeader className="bg-slate-100">
                                        <TableRow>
                                            <TableHead>Sản phẩm</TableHead>
                                            <TableHead className="w-32 text-right">Giá</TableHead>
                                            <TableHead className="w-24 text-center">Số lượng</TableHead>
                                            <TableHead className="w-32 text-right">Tạm tính</TableHead>
                                            <TableHead className="w-32 text-right">Tiết kiệm</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orderItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <p className="font-medium text-slate-900">{item?.product?.title}</p>
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    {currencyFormatter.format(item?.price || 0)}
                                                </TableCell>
                                                <TableCell className="text-center text-sm">{item?.qty}</TableCell>
                                                <TableCell className="text-right font-medium text-slate-900">
                                                    {currencyFormatter.format(item?.sub_total || 0)}
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-emerald-600">
                                                    {currencyFormatter.format(item?.saved || 0)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="grid gap-6 rounded-lg border border-slate-200 p-6 lg:grid-cols-2">
                                <div className="space-y-2 text-sm">
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Giao hàng đến</p>
                                    <p className="font-medium text-slate-900">{order.full_name}</p>
                                    <p className="text-muted-foreground">{order.city}, {order.state}</p>
                                    <p className="text-muted-foreground">{order.country}</p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Tạm tính</span>
                                        <span>{currencyFormatter.format(totals.subTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Phí vận chuyển</span>
                                        <span>{currencyFormatter.format(totals.shipping)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Thuế</span>
                                        <span>{currencyFormatter.format(totals.tax)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Phí dịch vụ</span>
                                        <span>{currencyFormatter.format(totals.serviceFee)}</span>
                                    </div>
                                    <Separator className="my-3" />
                                    <div className="flex justify-between text-lg font-semibold text-slate-900">
                                        <span>Tổng</span>
                                        <span>{currencyFormatter.format(totals.total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button onClick={handlePrint} className="gap-2 print:hidden">
                                    <Printer className="h-4 w-4" /> In hóa đơn
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Invoice
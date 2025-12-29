import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import VendorLayout from './VendorLayout'

function Orders() {
    const [orders, setOrders] = useState([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)

    const axios = apiInstance
    const userData = UserData()
    const vendorId = userData?.vendor_id

    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    useEffect(() => {
        if (UserData()?.vendor_id === 0) {
            window.location.href = '/vendor/register/'
        }
    }, [])

    useEffect(() => {
        if (!vendorId) return

        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(
                    `vendor/orders/${vendorId}/?page=${page}&page_size=${pageSize}`
                )

                // DRF pagination returns {count, next, previous, results}
                if (response.data?.results) {
                    setOrders(response.data.results)
                    setTotal(response.data.count || 0)
                } else {
                    // Fallback in case pagination not applied
                    setOrders(response.data || [])
                    setTotal(Array.isArray(response.data) ? response.data.length : 0)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [axios, vendorId, page, pageSize])

    const handlePrev = () => setPage((p) => Math.max(1, p - 1))
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1))

    return (
        <VendorLayout title="Tất Cả Đơn Hàng" description="Xem lại các đơn hàng gần đây và xem chi tiết của chúng.">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#ID</TableHead>
                        <TableHead>Tên</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Trạng Thái</TableHead>
                        <TableHead className="text-right">Hành Động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-6 text-center text-sm text-slate-500">
                                Đang tải...
                            </TableCell>
                        </TableRow>
                    ) : orders?.length ? (
                        orders.map((order) => (
                            <TableRow key={order.oid}>
                                <TableCell className="font-semibold">#{order.oid}</TableCell>
                                <TableCell>{order.full_name}</TableCell>
                                <TableCell>{moment(order.date).format('MM/DD/YYYY')}</TableCell>
                                <TableCell>{order.order_status}</TableCell>
                                <TableCell className="flex justify-end">
                                    <Button asChild size="sm" variant="outline">
                                        <Link to={`/vendor/orders/${order.oid}/`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="py-6 text-center text-sm text-slate-500">
                                Chưa có đơn hàng
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                    Trang {page} / {totalPages} • Tổng {total} đơn
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="rounded-md border px-2 py-1 text-sm"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value))
                            setPage(1)
                        }}
                    >
                        {[10, 20, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size} / trang
                            </option>
                        ))}
                    </select>
                    <Button variant="outline" size="sm" onClick={handlePrev} disabled={page === 1}>
                        Trước
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={page >= totalPages}
                    >
                        Sau
                    </Button>
                </div>
            </div>
        </VendorLayout>
    )
}

export default Orders
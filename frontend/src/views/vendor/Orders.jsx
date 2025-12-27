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

    const axios = apiInstance
    const userData = UserData()
    const vendorId = userData?.vendor_id

    useEffect(() => {
        if (UserData()?.vendor_id === 0) {
            window.location.href = '/vendor/register/'
        }
    }, [])

    useEffect(() => {
        if (!vendorId) {
            return
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`vendor/orders/${vendorId}/`)
                setOrders(response.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [axios, vendorId])

    return (
        <VendorLayout title="All Orders" description="Review recent orders and drill into their details.">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders?.length ? (
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
                                No orders yet
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </VendorLayout>
    )
}

export default Orders
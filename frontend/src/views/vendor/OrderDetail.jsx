import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ClipboardCheck, CreditCard, PackageCheck, Truck, Receipt, Cog, Percent } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import VendorLayout from './VendorLayout'

const summaryConfig = [
  {
    key: 'total',
    label: 'Total',
    prefix: '$',
    icon: ClipboardCheck,
    accent: 'bg-emerald-500/10 text-emerald-600'
  },
  {
    key: 'payment_status',
    label: 'Payment Status',
    transform: (value) => value?.toUpperCase() || 'PENDING',
    icon: CreditCard,
    accent: 'bg-indigo-500/10 text-indigo-600'
  },
  {
    key: 'order_status',
    label: 'Order Status',
    icon: PackageCheck,
    accent: 'bg-sky-500/10 text-sky-600'
  },
  {
    key: 'shipping_amount',
    label: 'Shipping Amount',
    prefix: '$',
    icon: Truck,
    accent: 'bg-cyan-500/10 text-cyan-600'
  },
  {
    key: 'tax_fee',
    label: 'Tax Fee',
    prefix: '$',
    icon: Receipt,
    accent: 'bg-fuchsia-500/10 text-fuchsia-600'
  },
  {
    key: 'service_fee',
    label: 'Service Fee',
    prefix: '$',
    icon: Cog,
    accent: 'bg-amber-500/10 text-amber-600'
  },
  {
    key: 'saved',
    label: 'Discount',
    prefix: '-$',
    icon: Percent,
    accent: 'bg-rose-500/10 text-rose-600'
  }
]

function OrderDetail() {
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])

  const axios = apiInstance
  const userData = UserData()
  const vendorId = userData?.vendor_id
  const params = useParams()

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
        const response = await axios.get(`vendor/orders/${vendorId}/${params.oid}`)
        setOrder(response.data)
        setOrderItems(response.data.orderitem)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [axios, params.oid, vendorId])

  return (
    <VendorLayout
      title={`Order #${order?.oid ?? ''}`}
      description="Review the order breakdown and manage fulfilment steps."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {summaryConfig.map(({ key, label, prefix, transform, icon: Icon, accent }) => {
          const value = transform ? transform(order?.[key]) : order?.[key]
          const displayValue = value !== undefined && value !== null ? `${prefix ?? ''}${value}` : '—'

          return (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
                <span className={cn('rounded-full p-2', accent)}>
                  <Icon className="h-5 w-5" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-slate-900">{displayValue}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems?.length ? (
                  orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={item?.product?.image}
                            alt={item?.product?.title}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                          <Link
                            to={`/detail/${item.product.slug}`}
                            className="font-medium text-slate-800 hover:text-primary"
                          >
                            {item?.product?.title}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>${item.product.price}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>${item.sub_total}</TableCell>
                      <TableCell className="text-rose-500">-${item.saved}</TableCell>
                      <TableCell className="flex justify-end">
                        <Button
                          asChild
                          variant={item.tracking_id ? 'outline' : 'default'}
                          size="sm"
                        >
                          <Link to={`/vendor/orders/${params.oid}/${item.id}/`}>
                            {item.tracking_id ? 'Edit Tracking' : 'Add Tracking'}
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-6 text-center text-sm text-slate-500">
                      No order items yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </VendorLayout>
  )
}

export default OrderDetail
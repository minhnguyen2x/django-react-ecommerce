import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import { LayoutGrid, ShoppingCart, DollarSign, Eye, Edit, Trash2 } from 'lucide-react'

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

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [orderChartData, setOrderChartData] = useState([])
  const [productsChartData, setProductsChartData] = useState([])
  const [activeTab, setActiveTab] = useState('products')

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

    const fetchStats = async () => {
      try {
        const response = await axios.get(`vendor/stats/${vendorId}/`)
        setStats(response.data[0])
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`vendor/products/${vendorId}/`)
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`vendor/orders/${vendorId}/`)
        setOrders(response.data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    fetchStats()
    fetchProducts()
    fetchOrders()
  }, [axios, vendorId])

  useEffect(() => {
    if (!vendorId) {
      return
    }

    const fetchChartData = async () => {
      try {
        const orderResponse = await axios.get(`vendor-orders-report-chart/${vendorId}/`)
        setOrderChartData(orderResponse.data)

        const productResponse = await axios.get(`vendor-products-report-chart/${vendorId}/`)
        setProductsChartData(productResponse.data)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      }
    }

    fetchChartData()
  }, [axios, vendorId])

  const orderMonths = orderChartData?.map((item) => item.month)
  const orderCounts = orderChartData?.map((item) => item.orders)

  const productLabels = productsChartData?.map((item) => item.month)
  const productCounts = productsChartData?.map((item) => item.orders)

  const orderData = {
    labels: orderMonths,
    datasets: [
      {
        label: 'Total Orders',
        data: orderCounts,
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)'
      }
    ]
  }

  const productData = {
    labels: productLabels,
    datasets: [
      {
        label: 'Total Products',
        data: productCounts,
        fill: true,
        backgroundColor: 'rgba(8, 145, 178, 0.2)',
        borderColor: 'rgba(8, 145, 178, 1)'
      }
    ]
  }

  const statCards = [
    {
      label: 'Products',
      value: stats?.products || 0,
      icon: LayoutGrid,
      accent: 'bg-sky-500/10 text-sky-600'
    },
    {
      label: 'Orders',
      value: stats?.orders || 0,
      icon: ShoppingCart,
      accent: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      label: 'Revenue',
      value: `$${stats?.revenue || 0}`,
      icon: DollarSign,
      accent: 'bg-amber-500/10 text-amber-600'
    }
  ]

  return (
    <VendorLayout
      title="Vendor Dashboard"
      description="Track performance, orders, and manage your catalogue."
      actions={
        <div className="flex gap-2">
          <Button variant="outline">Daily Report</Button>
          <Button variant="outline">Monthly Report</Button>
          <Button variant="outline">Yearly Report</Button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
          <Card key={label} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
              <span className={cn('rounded-full p-2', accent)}>
                <Icon className="h-5 w-5" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <Line data={orderData} options={{ maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Products Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <Line data={productData} options={{ maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Inventory & Orders</h2>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('products')}
            >
              Products
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </Button>
          </div>
        </div>

        {activeTab === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.length ? (
                    products.map((p) => (
                      <TableRow key={p.sku}>
                        <TableCell className="font-medium">#{p.sku}</TableCell>
                        <TableCell>{p.title}</TableCell>
                        <TableCell>${p.price}</TableCell>
                        <TableCell>{p.stock_qty}</TableCell>
                        <TableCell>{p.order_count}</TableCell>
                        <TableCell className="uppercase text-xs font-semibold text-slate-500">{p?.status}</TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/detail/${p.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-6 text-center text-sm text-slate-500">
                        No products yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
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
                    orders.map((o) => (
                      <TableRow key={o.oid}>
                        <TableCell className="font-medium">#{o.oid}</TableCell>
                        <TableCell>{o.full_name}</TableCell>
                        <TableCell>{moment(o.date).format('MM/DD/YYYY')}</TableCell>
                        <TableCell>{o.order_status}</TableCell>
                        <TableCell className="flex justify-end">
                          <Button asChild size="sm" variant="outline">
                            <Link to="">
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
            </CardContent>
          </Card>
        )}
      </section>
    </VendorLayout>
  )
}

export default Dashboard
import React, { useEffect, useMemo, useState } from 'react'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import { DollarSign, TrendingUp } from 'lucide-react'

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

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

function Earning() {
  const [earningStats, setEarningStats] = useState({ total_revenue: 0, monthly_revenue: 0 })
  const [monthlyEarnings, setMonthlyEarnings] = useState([])
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

    const fetchEarnings = async () => {
      try {
        const [summaryResponse, monthlyResponse] = await Promise.all([
          axios.get(`vendor-earning/${vendorId}/`),
          axios.get(`vendor-monthly-earning/${vendorId}/`)
        ])

        setEarningStats(summaryResponse.data?.[0] || { total_revenue: 0, monthly_revenue: 0 })
        setMonthlyEarnings(monthlyResponse.data || [])
      } catch (error) {
        console.error('Error fetching earnings:', error)
      }
    }

    fetchEarnings()
  }, [axios, vendorId])

  const revenueData = useMemo(() => {
    const sorted = [...monthlyEarnings].sort((a, b) => a.month - b.month)
    return {
      labels: sorted.map((item) => MONTH_LABELS[(item.month || 1) - 1]),
      datasets: [
        {
          label: 'Revenue Analytics',
          data: sorted.map((item) => Number(item.total_earning || 0)),
          fill: true,
          backgroundColor: 'rgba(14, 116, 144, 0.15)',
          borderColor: 'rgb(14, 116, 144)',
          tension: 0.35,
          pointRadius: 3
        }
      ]
    }
  }, [monthlyEarnings])

  const revenueCards = useMemo(
    () => [
      {
        label: 'Total Revenue',
        value: `$${Number(earningStats.total_revenue || 0).toFixed(2)}`,
        accent: 'bg-emerald-500/10 text-emerald-600'
      },
      {
        label: 'Monthly Revenue',
        value: `$${Number(earningStats.monthly_revenue || 0).toFixed(2)}`,
        accent: 'bg-sky-500/10 text-sky-600'
      }
    ],
    [earningStats]
  )

  return (
    <VendorLayout
      title="Earning & Revenue"
      description="Track your revenue performance across months."
      actions={
        <Button variant="outline" size="sm" className="gap-2" disabled>
          <TrendingUp className="h-4 w-4" />
          Reports coming soon
        </Button>
      }
    >
      <section className="grid gap-4 md:grid-cols-2">
        {revenueCards.map(({ label, value, accent }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
              <span className={cn('rounded-full bg-slate-200 p-2 text-slate-600', accent)}>
                <DollarSign className="h-5 w-5" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Revenue Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyEarnings?.length ? (
                  monthlyEarnings
                    .sort((a, b) => a.month - b.month)
                    .map((earning) => (
                      <TableRow key={earning.month}>
                        <TableCell>{MONTH_LABELS[(earning.month || 1) - 1]}</TableCell>
                        <TableCell>{earning.sales_count}</TableCell>
                        <TableCell>${Number(earning.total_earning || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="py-6 text-center text-sm text-slate-500">
                      No revenue data yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <Line data={revenueData} options={{ maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>
      </section>
    </VendorLayout>
  )
}

export default Earning
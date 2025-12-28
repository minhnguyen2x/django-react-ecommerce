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
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12'
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
          label: 'Phân Tích Doanh Thu',
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
        label: 'Tổng Doanh Thu',
        value: `$${Number(earningStats.total_revenue || 0).toFixed(2)}`,
        accent: 'bg-emerald-500/10 text-emerald-600'
      },
      {
        label: 'Doanh Thu Tháng',
        value: `$${Number(earningStats.monthly_revenue || 0).toFixed(2)}`,
        accent: 'bg-sky-500/10 text-sky-600'
      }
    ],
    [earningStats]
  )

  return (
    <VendorLayout
      title="Thu Nhập & Doanh Thu"
      description="Theo dõi hiệu suất doanh thu của bạn theo tháng."
      actions={
        <Button variant="outline" size="sm" className="gap-2" disabled>
          <TrendingUp className="h-4 w-4" />
          Báo cáo sắp ra mắt
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
            <CardTitle>Theo Dõi Doanh Thu</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tháng</TableHead>
                  <TableHead>Doanh Số</TableHead>
                  <TableHead>Doanh Thu</TableHead>
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
                      Chưa có dữ liệu doanh thu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Phân Tích Doanh Thu</CardTitle>
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
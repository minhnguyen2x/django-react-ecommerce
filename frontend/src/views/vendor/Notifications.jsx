import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { BellRing, Eye, EyeOff, Inbox, CheckCircle2, ListChecks } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
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

function Notifications() {
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const [readNotifications, setReadNotifications] = useState([])
  const [stats, setStats] = useState({ un_read_noti: 0, read_noti: 0, all_noti: 0 })
  const [dialogOpen, setDialogOpen] = useState(false)
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

    const fetchNotifications = async () => {
      try {
        const [unseenResponse, seenResponse, statsResponse] = await Promise.all([
          axios.get(`vendor-notifications-unseen/${vendorId}/`),
          axios.get(`vendor-notifications-seen/${vendorId}/`),
          axios.get(`vendor-notifications-summary/${vendorId}/`)
        ])

        setUnreadNotifications(unseenResponse.data || [])
        setReadNotifications(seenResponse.data || [])
        setStats(statsResponse.data?.[0] || { un_read_noti: 0, read_noti: 0, all_noti: 0 })
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()
  }, [axios, vendorId])

  const handleMarkAsSeen = async (notificationId) => {
    try {
      await axios.get(`vendor-notifications-mark-as-seen/${vendorId}/${notificationId}/`)

      setUnreadNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
      const movedNotification = unreadNotifications.find((notification) => notification.id === notificationId)

      if (movedNotification) {
        setReadNotifications((prev) => [movedNotification, ...prev])
      }

      setStats((prev) => ({
        un_read_noti: Math.max(0, (prev.un_read_noti || 0) - 1),
        read_noti: (prev.read_noti || 0) + 1,
        all_noti: prev.all_noti || 0
      }))
    } catch (error) {
      console.error('Error marking notification as seen:', error)
    }
  }

  const statCards = useMemo(
    () => [
      {
        label: 'Unread Notifications',
        value: stats.un_read_noti || 0,
        icon: EyeOff,
        accent: 'bg-rose-500/10 text-rose-600'
      },
      {
        label: 'Read Notifications',
        value: stats.read_noti || 0,
        icon: Eye,
        accent: 'bg-emerald-500/10 text-emerald-600'
      },
      {
        label: 'All Notifications',
        value: stats.all_noti || 0,
        icon: BellRing,
        accent: 'bg-indigo-500/10 text-indigo-600'
      }
    ],
    [stats]
  )

  const renderType = (notification) => {
    if (notification.order) {
      return `New Order #${notification.order.oid}`
    }
    if (notification.order_item) {
      return `Order Item: ${notification.order_item.product?.title}`
    }
    return 'Notification'
  }

  const renderMessage = (notification) => {
    if (notification.order_item) {
      return `You've got a new order for ${notification.order_item.product?.title}`
    }
    if (notification.order) {
      return 'New order placed'
    }
    return notification?.message || '—'
  }

  const renderStatusBadge = (isSeen) => (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        isSeen ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-600'
      )}
    >
      {isSeen ? <CheckCircle2 className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      {isSeen ? 'Read' : 'Unread'}
    </span>
  )

  return (
    <VendorLayout
      title="Notifications"
      description="Stay informed about new orders and account updates."
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ListChecks className="h-4 w-4" />
              View Read Notifications
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Read Notifications</DialogTitle>
              <DialogDescription>Every notification that has already been acknowledged.</DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {readNotifications?.length ? (
                  readNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>{renderType(notification)}</TableCell>
                      <TableCell>{renderMessage(notification)}</TableCell>
                      <TableCell>{renderStatusBadge(true)}</TableCell>
                      <TableCell>{moment(notification.date).format('MMM/DD/YYYY')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-6 text-center text-sm text-slate-500">
                      No read notifications yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
          <Card key={label}>
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

      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Unread Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unreadNotifications?.length ? (
                  unreadNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>{renderType(notification)}</TableCell>
                      <TableCell>{renderMessage(notification)}</TableCell>
                      <TableCell>{renderStatusBadge(notification.seen)}</TableCell>
                      <TableCell>{moment(notification.date).format('MMM/DD/YYYY')}</TableCell>
                      <TableCell className="flex justify-end">
                        <Button
                          variant={notification.seen ? 'outline' : 'default'}
                          size="sm"
                          className="gap-2"
                          onClick={() => handleMarkAsSeen(notification.id)}
                          disabled={notification.seen}
                        >
                          {notification.seen ? <Inbox className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          {notification.seen ? 'Seen' : 'Mark as Seen'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-6 text-center text-sm text-slate-500">
                      No notifications yet
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

export default Notifications
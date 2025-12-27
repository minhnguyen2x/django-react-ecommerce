import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Tag, Percent, CheckCircle2, Trash2, Pencil, BadgeCheck } from 'lucide-react'

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import VendorLayout from './VendorLayout'

const DEFAULT_STATS = { total_coupons: 0, active_coupons: 0 }

function Coupon() {
    const [coupons, setCoupons] = useState([])
    const [stats, setStats] = useState(DEFAULT_STATS)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [formState, setFormState] = useState({ code: '', discount: '', active: false })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const axios = apiInstance
    const userData = UserData()
    const vendorId = userData?.vendor_id

    useEffect(() => {
        if (vendorId === 0) {
            window.location.href = '/vendor/register/'
        }
    }, [vendorId])

    const fetchCoupons = useCallback(async () => {
        if (!vendorId) {
            return
        }

        try {
            const response = await axios.get(`vendor/coupons/${vendorId}/`)
            setCoupons(response.data.coupons || [])
            setStats(response.data.stats || DEFAULT_STATS)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [axios, vendorId])

    useEffect(() => {
        fetchCoupons()
    }, [fetchCoupons])

    const handleDeleteCoupon = useCallback(
        async (couponId) => {
            if (!vendorId) {
                return
            }

            try {
                await axios.delete(`vendor-coupon-delete/${vendorId}/${couponId}/`)
                setCoupons((prev) => prev.filter((coupon) => coupon.id !== couponId))
                setStats((prev) => {
                    const removed = coupons.find((coupon) => coupon.id === couponId)
                    return {
                        total_coupons: Math.max(0, (prev.total_coupons || 0) - 1),
                        active_coupons:
                            Math.max(0, (prev.active_coupons || 0) - (removed?.active ? 1 : 0))
                    }
                })
            } catch (error) {
                console.error('Error deleting coupon:', error)
            }
        },
        [axios, vendorId, coupons]
    )

    const handleCreateCoupon = useCallback(
        async (event) => {
            event.preventDefault()

            if (!vendorId || !formState.code || !formState.discount) {
                return
            }

            setIsSubmitting(true)

            try {
                const formData = new FormData()
                formData.append('vendor_id', vendorId)
                formData.append('code', formState.code)
                formData.append('discount', formState.discount)
                formData.append('active', formState.active)

                const response = await axios.post(`vendor-coupon-create/${vendorId}/`, formData)
                const newCoupon = response.data?.coupon

                setFormState({ code: '', discount: '', active: false })
                setDialogOpen(false)

                if (newCoupon) {
                    setCoupons((prev) => [newCoupon, ...prev])
                    setStats((prev) => ({
                        total_coupons: (prev.total_coupons || 0) + 1,
                        active_coupons: (prev.active_coupons || 0) + (newCoupon.active ? 1 : 0)
                    }))
                } else {
                    await fetchCoupons()
                }
            } catch (error) {
                console.error('Error creating coupon:', error)
            } finally {
                setIsSubmitting(false)
            }
        },
        [axios, vendorId, formState, fetchCoupons]
    )

    const statCards = useMemo(
        () => [
            {
                label: 'Total Coupons',
                value: stats.total_coupons || 0,
                icon: Tag,
                accent: 'bg-sky-500/10 text-sky-600'
            },
            {
                label: 'Active Coupons',
                value: stats.active_coupons || 0,
                icon: CheckCircle2,
                accent: 'bg-emerald-500/10 text-emerald-600'
            }
        ],
        [stats]
    )

    return (
        <VendorLayout
            title="Coupons"
            description="Create and manage discount codes for your customers."
            actions={
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Coupon
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Coupon</DialogTitle>
                            <DialogDescription>Provide a code and discount percentage.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateCoupon} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="coupon-code">Code</Label>
                                <Input
                                    id="coupon-code"
                                    name="code"
                                    placeholder="E.g DESTINY2025"
                                    value={formState.code}
                                    onChange={(event) =>
                                        setFormState((prev) => ({ ...prev, code: event.target.value }))
                                    }
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Use unique, easy-to-remember codes.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coupon-discount">Discount (%)</Label>
                                <Input
                                    id="coupon-discount"
                                    name="discount"
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="Enter percentage"
                                    value={formState.discount}
                                    onChange={(event) =>
                                        setFormState((prev) => ({ ...prev, discount: event.target.value }))
                                    }
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Discount is applied as a percentage.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="coupon-active"
                                    name="active"
                                    checked={formState.active}
                                    onCheckedChange={(checked) =>
                                        setFormState((prev) => ({ ...prev, active: Boolean(checked) }))
                                    }
                                />
                                <Label htmlFor="coupon-active" className="text-sm font-medium">
                                    Activate immediately
                                </Label>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="gap-2">
                                    {isSubmitting ? 'Creating…' : 'Create Coupon'}
                                    <BadgeCheck className="h-4 w-4" />
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            }
        >
            <section className="grid gap-4 md:grid-cols-2">
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
                        <CardTitle>Coupon List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[20%]">Code</TableHead>
                                    <TableHead className="w-[15%]">Type</TableHead>
                                    <TableHead className="w-[20%]">Discount</TableHead>
                                    <TableHead className="w-[20%]">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coupons?.length ? (
                                    coupons.map((coupon) => (
                                        <TableRow key={coupon.id}>
                                            <TableCell className="font-medium">{coupon.code}</TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                <Percent className="h-4 w-4 text-slate-400" />
                                                Percentage
                                            </TableCell>
                                            <TableCell>{coupon.discount}%</TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                                                        coupon.active
                                                            ? 'bg-emerald-500/10 text-emerald-600'
                                                            : 'bg-slate-200 text-slate-600'
                                                    )}
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    {coupon.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="flex justify-end gap-2">
                                                <Button asChild size="sm" variant="outline">
                                                    <Link to={`/vendor/coupon/${coupon.id}/`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteCoupon(coupon.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-6 text-center text-sm text-slate-500">
                                            No coupons yet
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

export default Coupon
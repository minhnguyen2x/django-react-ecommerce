import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Plus, Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
import { deleteProduct } from '../plugin/DeleteProduct'

const FILTER_OPTIONS = [
    { value: 'no-filter', label: 'Không Lọc' },
    { value: 'published', label: 'Trạng Thái: Đã Đăng' },
    { value: 'draft', label: 'Trạng Thái: Bản Nháp' },
    { value: 'in-review', label: 'Trạng Thái: Đang Duyệt' },
    { value: 'disabled', label: 'Trạng Thái: Vô Hiệu' },
    { value: 'latest', label: 'Ngày: Mới Nhất' },
    { value: 'oldest', label: 'Ngày: Cũ Nhất' }
]

const STATUS_STYLES = {
    published: 'bg-emerald-500/10 text-emerald-600 border-transparent',
    draft: 'bg-amber-500/10 text-amber-600 border-transparent',
    'in-review': 'bg-sky-500/10 text-sky-600 border-transparent',
    disabled: 'bg-rose-500/10 text-rose-600 border-transparent'
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

function Products() {
    const [products, setProducts] = useState([])
    const [activeFilter, setActiveFilter] = useState('no-filter')

    const axios = apiInstance
    const userData = UserData()
    const vendorId = userData?.vendor_id

    useEffect(() => {
        if (vendorId === 0) {
            window.location.href = '/vendor/register/'
        }
    }, [vendorId])

    const fetchProducts = useCallback(async () => {
        if (!vendorId) {
            return
        }

        try {
            const response = await axios.get(`vendor/products/${vendorId}/`)
            setProducts(response.data || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [axios, vendorId])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handleFilterProduct = useCallback(
        async (param) => {
            if (!vendorId) {
                return
            }

            setActiveFilter(param)

            if (param === 'no-filter') {
                await fetchProducts()
                return
            }

            try {
                const response = await axios.get(`vendor-product-filter/${vendorId}?filter=${param}`)
                setProducts(response.data || [])
            } catch (error) {
                console.error('Error filtering products:', error)
            }
        },
        [axios, vendorId, fetchProducts]
    )

    const handleDeleteProduct = useCallback(
        async (productPid) => {
            if (!vendorId) {
                return
            }

            try {
                await deleteProduct(vendorId, productPid)
                if (activeFilter === 'no-filter') {
                    await fetchProducts()
                } else {
                    await handleFilterProduct(activeFilter)
                }
            } catch (error) {
                console.error('Error deleting product:', error)
            }
        },
        [vendorId, activeFilter, fetchProducts, handleFilterProduct]
    )

    const activeFilterLabel = useMemo(() => {
        return FILTER_OPTIONS.find((option) => option.value === activeFilter)?.label || 'Không Lọc'
    }, [activeFilter])

    return (
        <VendorLayout
            title="Sản Phẩm"
            description="Lọc, kiểm tra và quản lý các sản phẩm trong danh mục của bạn."
            actions={
                <div className="flex flex-wrap items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="h-4 w-4" />
                                {activeFilterLabel}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Lọc Sản Phẩm</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {FILTER_OPTIONS.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onSelect={() => handleFilterProduct(option.value)}
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button asChild size="sm" className="gap-2">
                        <Link to="/vendor/product/new/">
                            <Plus className="h-4 w-4" />
                            Thêm Sản Phẩm
                        </Link>
                    </Button>
                </div>
            }
        >
            <Card>
                <CardHeader>
                    <CardTitle>Tổng Quan Sản Phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[12%]">Mã SP</TableHead>
                                <TableHead>Tên</TableHead>
                                <TableHead className="w-[12%]">Giá</TableHead>
                                <TableHead className="w-[12%]">Số Lượng</TableHead>
                                <TableHead className="w-[12%]">Đơn Hàng</TableHead>
                                <TableHead className="w-[14%]">Trạng Thái</TableHead>
                                <TableHead className="text-right">Hành Động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.length ? (
                                products.map((product) => {
                                    const status = product?.status?.toLowerCase()

                                    return (
                                        <TableRow key={product.pid}>
                                            <TableCell className="font-semibold">#{product.sku}</TableCell>
                                            <TableCell className="font-medium text-slate-700">{product.title}</TableCell>
                                            <TableCell>{currencyFormatter.format(product.price || 0)}</TableCell>
                                            <TableCell>{product.stock_qty}</TableCell>
                                            <TableCell>{product.order_count}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn('capitalize', STATUS_STYLES[status] || 'border-transparent bg-slate-200 text-slate-600')}
                                                >
                                                    {product?.status || 'Không rõ'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link to={`/detail/${product.slug}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link to={`/vendor/product/update/${product.pid}/`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteProduct(product.pid)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-6 text-center text-sm text-slate-500">
                                        Chưa có sản phẩm
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </VendorLayout>
    )
}

export default Products
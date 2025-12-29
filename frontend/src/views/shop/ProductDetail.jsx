import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'
import { Loader2, ShoppingCart, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { ScrollToTop } from '@/components/ui/scroll-to-top'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import apiInstance from '../../utils/axios'
import Addon from '../plugin/Addon'
import GetCurrentAddress from '../plugin/UserCountry'
import UserData from '../plugin/UserData'
import CartID from '../plugin/cartID'
import { addToCart } from '../plugin/AddToCart'
import { CartContext } from '../plugin/Context'

function ProductDetail() {
    const [product, setProduct] = useState(null)
    const [productImage, setProductImage] = useState('')
    const [gallery, setGallery] = useState([])
    const [specifications, setSpecifications] = useState([])
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])
    const [vendor, setVendor] = useState(null)
    const [colorValue, setColorValue] = useState('No Color')
    const [sizeValue, setSizeValue] = useState('No Size')
    const [qtyValue, setQtyValue] = useState(1)
    const [isAddingToCart, setIsAddingToCart] = useState('Add To Cart')
    const [loading, setLoading] = useState(true)
    const [reviews, setReviews] = useState([])
    const [reviewForm, setReviewForm] = useState({ rating: '5', review: '' })

    const addon = Addon()
    const currentAddress = GetCurrentAddress()
    const userData = UserData()

    const axios = apiInstance
    const { slug } = useParams()
    const cartId = CartID()
    const [, setCartCount] = useContext(CartContext)

    const loadReviews = async (productId) => {
        try {
            const response = await axios.get(`reviews/${productId}/`)
            setReviews(response.data || [])
        } catch (error) {
            console.error('Error fetching reviews:', error)
            setReviews([])
        }
    }

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const response = await axios.get(`products/${slug}`)
                const data = response.data
                setProduct(data)
                setProductImage(data.image)
                setGallery(data.gallery || [])
                setSpecifications(data.specification || [])
                setColors(data.color || [])
                setSizes(data.size || [])
                setVendor(data.vendor || null)
                setColorValue('No Color')
                setSizeValue('No Size')
            } catch (error) {
                console.error('Error fetching product:', error)
                setProduct(null)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [axios, slug])

    useEffect(() => {
        if (product?.id) {
            loadReviews(product.id)
        }
    }, [product?.id])

    const ratingValue = Number(product?.product_rating || 0)
    const ratingCount = product?.rating_count || 0

    const stars = useMemo(
        () => Array.from({ length: 5 }, (_, index) => index < Math.round(ratingValue)),
        [ratingValue]
    )

    const discountLabel = product?.get_precentage ? `${product.get_precentage}% OFF` : null

    const currency = addon?.currency_sign || '$'

    const handleColorSelection = (colorOption) => {
        setColorValue(colorOption.name)
        if (colorOption.image) {
            setProductImage(colorOption.image)
        }
    }

    const handleSizeSelection = (sizeOption) => {
        setSizeValue(sizeOption.name)
    }

    const handleQuantityChange = (event) => {
        const value = Math.max(1, Number(event.target.value) || 1)
        setQtyValue(value)
    }

    const refreshCartCount = async () => {
        try {
            const url = userData?.user_id
                ? `cart-list/${cartId}/${userData?.user_id}/`
                : `cart-list/${cartId}/`
            const response = await axios.get(url)
            setCartCount(response.data.length)
        } catch (error) {
            console.error('Error refreshing cart count:', error)
        }
    }

    const handleAddToCartClick = async () => {
        if (!product) {
            return
        }

        setIsAddingToCart('Processing...')

        try {
            await addToCart(
                product.id,
                userData?.user_id,
                qtyValue,
                product.price,
                product.shipping_amount,
                currentAddress.country,
                sizeValue,
                colorValue,
                cartId,
                setIsAddingToCart
            )

            await refreshCartCount()
            setIsAddingToCart('Added To Cart')
            Swal.fire({ icon: 'success', title: 'Đã thêm vào giỏ hàng' })
        } catch (error) {
            console.error('Error adding to cart:', error)
            setIsAddingToCart('Add To Cart')
            Swal.fire({ icon: 'error', title: 'Không thể thêm vào giỏ hàng' })
        }

        setTimeout(() => {
            setIsAddingToCart('Add To Cart')
        }, 2000)
    }

    const handleReviewSubmit = async (event) => {
        event.preventDefault()

        if (!userData?.user_id || !product?.id) {
            Swal.fire({ icon: 'info', title: 'Đăng nhập để viết đánh giá' })
            return
        }

        try {
            const formdata = new FormData()
            formdata.append('user_id', userData.user_id)
            formdata.append('product_id', product.id)
            formdata.append('rating', reviewForm.rating)
            formdata.append('review', reviewForm.review)

            await axios.post('create-review/', formdata)
            await loadReviews(product.id)
            setReviewForm({ rating: '5', review: '' })
            Swal.fire({ icon: 'success', title: 'Đánh giá đã được tạo thành công' })
        } catch (error) {
            console.error('Error submitting review:', error)
            Swal.fire({ icon: 'error', title: 'Không thể gửi đánh giá' })
        }
    }

    if (loading) {
        return (
            <div className=" bg-slate-50">
                <ScrollToTop />
                <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-24">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">Đang tải chi tiết sản phẩm…</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className=" bg-slate-50">
                <ScrollToTop />
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
                    <Card className="shadow-sm">
                        <CardContent className="space-y-3 py-12">
                            <CardTitle className="text-2xl">Không tìm thấy sản phẩm</CardTitle>
                            <p className="text-sm text-muted-foreground">Sản phẩm bạn đang tìm hiện không khả dụng.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className=" bg-slate-50">
            <ScrollToTop />
            <div className="mx-auto w-full max-w-6xl px-4 py-10">
                <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
                    <div>
                        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                            <img
                                src={productImage}
                                alt={product.title}
                                className="h-[480px] w-full object-cover"
                            />
                        </div>
                        {gallery?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-3">
                                {gallery.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setProductImage(item.image)}
                                        className="overflow-hidden rounded-xl border border-transparent transition focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.id}
                                            className="h-20 w-20 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge variant="secondary" className="uppercase tracking-wide">
                                    {product?.brand?.title}
                                </Badge>
                                {discountLabel && (
                                    <Badge variant="destructive">{discountLabel}</Badge>
                                )}
                            </div>

                            <h1 className="text-3xl font-semibold text-slate-900">{product.title}</h1>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    {stars.map((active, index) => (
                                        <Star
                                            key={index}
                                            className={cn('h-4 w-4', active ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300')}
                                        />
                                    ))}
                                </div>
                                <span>
                                    {ratingValue ? `${ratingValue.toFixed(1)}/5.0` : 'Chưa có đánh giá'} ({ratingCount}{' '}
                                    đánh giá)
                                </span>
                            </div>

                            <div className="flex items-end gap-3">
                                <span className="text-3xl font-semibold text-primary">
                                    {currency}
                                    {product.price}
                                </span>
                                {product.old_price && (
                                    <span className="text-sm text-muted-foreground line-through">
                                        {currency}
                                        {product.old_price}
                                    </span>
                                )}
                            </div>

                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {product.description?.slice(0, 300)}...
                            </p>
                        </div>

                        {specifications.length > 0 && (
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Thông số nổi bật</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-3">
                                    {specifications.slice(0, 4).map((item) => (
                                        <div key={item.title} className="flex justify-between text-sm">
                                            <span className="font-medium text-slate-700">{item.title}</span>
                                            <span className="text-right text-muted-foreground">{item.content}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Số lượng</label>
                                <Input type="number" min={1} value={qtyValue} onChange={handleQuantityChange} />
                            </div>

                            {sizes.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Kích cỡ</label>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size) => (
                                            <Button
                                                key={size.id || size.name}
                                                type="button"
                                                variant={sizeValue === size.name ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => handleSizeSelection(size)}
                                            >
                                                {size.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {colors.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Màu sắc
                                        <span className="ml-2 text-muted-foreground">{colorValue}</span>
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((colorOption) => (
                                            <button
                                                key={colorOption.id || colorOption.name}
                                                type="button"
                                                onClick={() => handleColorSelection(colorOption)}
                                                className={cn(
                                                    'h-10 w-10 rounded-full border border-slate-200 transition focus:outline-none focus:ring-2 focus:ring-primary',
                                                    colorValue === colorOption.name && 'ring-2 ring-primary ring-offset-2'
                                                )}
                                                style={{ backgroundColor: colorOption.color_code }}
                                                aria-label={colorOption.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={handleAddToCartClick}
                                className="flex-1 gap-2"
                                disabled={isAddingToCart === 'Processing...'}
                            >
                                {isAddingToCart === 'Processing...' && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isAddingToCart === 'Add To Cart' && <ShoppingCart className="h-4 w-4" />}
                                {isAddingToCart === 'Added To Cart' && <ShoppingCart className="h-4 w-4" />}
                                {isAddingToCart}
                            </Button>
                        </div>

                        <Tabs defaultValue="specs" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="specs">Thông số</TabsTrigger>
                                <TabsTrigger value="vendor">Nhà bán</TabsTrigger>
                                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                            </TabsList>

                            <TabsContent value="specs" className="space-y-4">
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-base">Bảng thông số</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {specifications.length > 0 ? (
                                            specifications.map((item) => (
                                                <div key={item.title} className="grid gap-2 rounded-lg bg-slate-100 p-3 sm:grid-cols-[160px_1fr]">
                                                    <span className="font-medium text-slate-700">{item.title}</span>
                                                    <span className="text-sm text-slate-600">{item.content}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Chưa có thông số chi tiết.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="vendor">
                                <Card className="shadow-sm">
                                    <CardContent className="flex flex-col gap-4 p-6 sm:flex-row">
                                        <div className="h-32 w-32 overflow-hidden rounded-xl border">
                                            <img
                                                src={vendor?.image}
                                                alt={vendor?.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <CardTitle className="text-xl">{vendor?.name}</CardTitle>
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {vendor?.description || 'Nhà bán chưa cập nhật mô tả.'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="reviews">
                                <div className="grid gap-8 lg:grid-cols-2">
                                    <Card className="shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="text-base">Viết đánh giá</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <form className="space-y-4" onSubmit={handleReviewSubmit}>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Đánh giá</label>
                                                    <Select
                                                        value={reviewForm.rating}
                                                        onValueChange={(value) => setReviewForm((prev) => ({ ...prev, rating: value }))}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Chọn số sao" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {[1, 2, 3, 4, 5].map((value) => (
                                                                <SelectItem key={value} value={String(value)}>
                                                                    {'★'.repeat(value)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Nội dung</label>
                                                    <Textarea
                                                        rows={4}
                                                        value={reviewForm.review}
                                                        onChange={(event) => setReviewForm((prev) => ({ ...prev, review: event.target.value }))}
                                                        placeholder="Chia sẻ trải nghiệm của bạn"
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full">
                                                    Gửi đánh giá
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>

                                    <div className="space-y-4">
                                        {reviews.length > 0 ? (
                                            reviews.map((review) => (
                                                <Card key={review.id} className="shadow-sm">
                                                    <CardContent className="flex gap-4 p-5">
                                                        <div className="h-14 w-14 overflow-hidden rounded-full border">
                                                            <img
                                                                src={review.profile?.image}
                                                                alt={review.profile?.full_name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="font-medium text-slate-900">
                                                                    {review.profile?.full_name || 'Người dùng'}
                                                                </p>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {moment(review.date).format('DD/MM/YYYY')}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{review.review}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        ) : (
                                            <Card className="shadow-sm">
                                                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                                                    Chưa có đánh giá nào.
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <Separator className="my-10" />

                <Card className="shadow-sm">
                    <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <span className="font-medium text-slate-900">Phí vận chuyển</span>
                            <p>
                                {currency}
                                {product.shipping_amount}
                            </p>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <span className="font-medium text-slate-900">Kho hàng</span>
                            <p>{product.stock_qty} sản phẩm</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProductDetail
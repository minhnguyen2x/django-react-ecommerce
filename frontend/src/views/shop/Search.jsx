import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaCheckCircle, FaShoppingCart, FaSpinner } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProductCardSkeleton } from '@/components/ui/product-skeleton'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

import apiInstance from '../../utils/axios'
import GetCurrentAddress from '../plugin/UserCountry'
import UserData from '../plugin/UserData'
import CartID from '../plugin/cartID'
import { addToCart } from '../plugin/AddToCart'
import { CartContext } from '../plugin/Context'

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

function Search() {
    const [products, setProducts] = useState([])
    const [loadingStates, setLoadingStates] = useState({})
    const [, setIsAddingToCart] = useState('Add To Cart')
    const [loading, setLoading] = useState(true)

    const axios = apiInstance
    const [searchParams] = useSearchParams()
    const query = searchParams.get('query') || ''

    const currentAddress = GetCurrentAddress()
    const userData = UserData()
    const cartId = CartID()
    const [, setCartCount] = useContext(CartContext)

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true)
            const response = await axios.get(`search/?query=${encodeURIComponent(query)}`)
            setProducts(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error('Error fetching data:', error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [axios, query])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handleAddToCart = async (productId, price, shippingAmount) => {
        setLoadingStates((prev) => ({ ...prev, [productId]: 'Adding...' }))

        try {
            await addToCart(
                productId,
                userData?.user_id,
                1, // default quantity
                price,
                shippingAmount,
                currentAddress.country,
                'No Color',
                'No Size',
                cartId,
                setIsAddingToCart
            )

            setLoadingStates((prev) => ({ ...prev, [productId]: 'Added to Cart' }))

            const url = userData?.user_id
                ? `cart-list/${cartId}/${userData?.user_id}/`
                : `cart-list/${cartId}/`
            const response = await axios.get(url)
            setCartCount(response.data.length)
        } catch (error) {
            console.error('Error adding to cart:', error)
            setLoadingStates((prev) => ({ ...prev, [productId]: 'Add to Cart' }))
        }
    }

    const headingText = useMemo(() => {
        const trimmed = query.trim()
        return trimmed ? `Search results for "${trimmed}"` : 'Search results'
    }, [query])

    const renderProducts = () => (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
                const productStatus = loadingStates[product.id]

                return (
                    <Card key={product.id} className="relative flex h-full flex-col overflow-hidden">
                        <Link to={`/detail/${product.slug}`} className="group block">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {product.featured && (
                                <Badge className="absolute right-3 top-3" variant="destructive">
                                    Featured
                                </Badge>
                            )}
                        </Link>

                        <CardContent className="flex flex-1 flex-col p-4">
                            <div className="space-y-2 text-left">
                                <p className="text-sm text-muted-foreground truncate">
                                    By:{' '}
                                    <Link to={`/vendor/${product?.vendor?.slug}`} className="font-medium hover:underline">
                                        {product.vendor?.name}
                                    </Link>
                                </p>
                                <Link to={`/detail/${product.slug}`} className="block">
                                    <h3 className="text-lg font-semibold text-slate-900 transition-colors hover:text-primary line-clamp-2 min-h-[3.5rem]">
                                        {product.title}
                                    </h3>
                                </Link>
                                <Badge variant="secondary" className="w-fit capitalize truncate max-w-full">
                                    {product?.brand?.title}
                                </Badge>
                                <p className="text-xl font-semibold text-primary">
                                    {currencyFormatter.format(product.price || 0)}
                                </p>
                            </div>

                            <div className="mt-4">
                                <Button
                                    onClick={() => handleAddToCart(product.id, product.price, product.shipping_amount)}
                                    disabled={productStatus === 'Adding...'}
                                    className="w-full"
                                >
                                    {productStatus === 'Added to Cart' ? (
                                        <span className="flex items-center gap-2">
                                            Đã thêm <FaCheckCircle className="h-4 w-4" />
                                        </span>
                                    ) : productStatus === 'Adding...' ? (
                                        <span className="flex items-center gap-2">
                                            Đang thêm <FaSpinner className="h-4 w-4 animate-spin" />
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Thêm vào giỏ <FaShoppingCart className="h-4 w-4" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <ScrollToTop />
            <div className="mx-auto w-full max-w-6xl px-4 py-10">
                <header className="mb-8 space-y-2 text-center">
                    <h1 className="text-3xl font-semibold text-slate-900">{headingText}</h1>
                    <p className="text-sm text-muted-foreground">
                        {loading ? 'Đang tìm kiếm sản phẩm…' : `${products.length} sản phẩm được tìm thấy.`}
                    </p>
                </header>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                ) : products.length ? (
                    renderProducts()
                ) : (
                    <Card className="p-8 text-center">
                        <CardContent className="space-y-3 p-0">
                            <h2 className="text-xl font-semibold text-slate-900">Không tìm thấy sản phẩm</h2>
                            <p className="text-sm text-muted-foreground">
                                Không có kết quả cho "{query}". Hãy thử tìm kiếm với từ khóa khác.
                            </p>
                            <Button asChild variant="outline">
                                <Link to="/">Quay lại cửa hàng</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Search
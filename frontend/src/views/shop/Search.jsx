import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaCheckCircle, FaShoppingCart, FaSpinner } from 'react-icons/fa'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ProductCardSkeleton } from '@/components/ui/product-skeleton'
import { ScrollToTop } from '@/components/ui/scroll-to-top'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

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

const hasVariations = (product) => {
    const hasColors = Array.isArray(product?.color) && product.color.length > 0
    const hasSizes = Array.isArray(product?.size) && product.size.length > 0
    return hasColors || hasSizes
}

function Search() {
    const [products, setProducts] = useState([])
    const [loadingStates, setLoadingStates] = useState({})
    const [, setIsAddingToCart] = useState('Add To Cart')
    const [loading, setLoading] = useState(true)

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedColors, setSelectedColors] = useState({})
    const [selectedSize, setSelectedSize] = useState({})
    const [colorImage, setColorImage] = useState('')
    const [colorValue, setColorValue] = useState('No Color')
    const [sizeValue, setSizeValue] = useState('No Size')
    const [qtyValue, setQtyValue] = useState(1)

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

    const handleColorButtonClick = (productId, colorName, image) => {
        setColorValue(colorName)
        setColorImage(image)
        setSelectedProduct(productId)
        setSelectedColors((prev) => ({ ...prev, [productId]: colorName }))
    }

    const handleSizeButtonClick = (productId, sizeName) => {
        setSizeValue(sizeName)
        setSelectedProduct(productId)
        setSelectedSize((prev) => ({ ...prev, [productId]: sizeName }))
    }

    const handleQtyChange = (event, productId) => {
        setQtyValue(Number(event.target.value) || 1)
        setSelectedProduct(productId)
    }

    const handleAddToCart = async (productId, price, shippingAmount) => {
        setLoadingStates((prev) => ({ ...prev, [productId]: 'Adding...' }))

        try {
            await addToCart(
                productId,
                userData?.user_id,
                qtyValue,
                price,
                shippingAmount,
                currentAddress.country,
                colorValue,
                sizeValue,
                cartId,
                setIsAddingToCart
            )

            setLoadingStates((prev) => ({ ...prev, [productId]: 'Added to Cart' }))
            setColorValue('No Color')
            setSizeValue('No Size')
            setQtyValue(1)

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
                const isSelected = selectedProduct === product.id
                const displayImage = isSelected && colorImage ? colorImage : product.image
                const productStatus = loadingStates[product.id]
                const variations = hasVariations(product)

                return (
                    <Card key={product.id} className="relative flex h-full flex-col overflow-hidden">
                        <Link to={`/detail/${product.slug}`} className="group block">
                            <img
                                src={displayImage}
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
                                <p className="text-sm text-muted-foreground">
                                    By:{' '}
                                    <Link to={`/vendor/${product?.vendor?.slug}`} className="font-medium hover:underline">
                                        {product.vendor?.name}
                                    </Link>
                                </p>
                                <Link to={`/detail/${product.slug}`} className="block">
                                    <h3 className="text-lg font-semibold text-slate-900 transition-colors hover:text-primary">
                                        {product.title.slice(0, 30)}...
                                    </h3>
                                </Link>
                                <Badge variant="secondary" className="w-fit capitalize">
                                    {product?.brand?.title}
                                </Badge>
                                <p className="text-xl font-semibold text-primary">
                                    {currencyFormatter.format(product.price || 0)}
                                </p>
                            </div>

                            <div className="mt-4 space-y-4">
                                {variations ? (
                                    <Collapsible className="space-y-3">
                                        <CollapsibleTrigger asChild>
                                            <Button variant="outline" className="group w-full justify-between">
                                                Biến Thể
                                                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="space-y-4 rounded-lg border p-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">Số lượng</p>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    defaultValue={1}
                                                    onChange={(event) => handleQtyChange(event, product.id)}
                                                />
                                            </div>

                                            {Array.isArray(product?.size) && product.size.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">
                                                        <span className="font-semibold">Kích cỡ:</span>{' '}
                                                        {selectedSize[product.id] || 'Chọn kích cỡ'}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.size.map((size) => (
                                                            <Button
                                                                key={size.name}
                                                                variant={selectedSize[product.id] === size.name ? 'default' : 'outline'}
                                                                size="sm"
                                                                onClick={() => handleSizeButtonClick(product.id, size.name)}
                                                            >
                                                                {size.name}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {Array.isArray(product?.color) && product.color.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">
                                                        <span className="font-semibold">Màu sắc:</span>{' '}
                                                        {selectedColors[product.id] || 'Chọn màu sắc'}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.color.map((color) => (
                                                            <button
                                                                key={color.id}
                                                                type="button"
                                                                className={cn(
                                                                    'h-10 w-10 rounded-full border border-slate-200 transition-transform',
                                                                    selectedColors[product.id] === color.name
                                                                        ? 'ring-2 ring-primary ring-offset-2'
                                                                        : 'hover:scale-110'
                                                                )}
                                                                style={{ backgroundColor: color.color_code }}
                                                                onClick={() => handleColorButtonClick(product.id, color.name, color.image)}
                                                                title={color.name}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

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
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
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
                                )}

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
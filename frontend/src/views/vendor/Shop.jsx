import { useContext, useEffect, useState } from 'react'
import { Check, Heart, Loader2, ShoppingCart } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import apiInstance from '../../utils/axios'
import { CartContext } from '../plugin/Context'
import { addToCart } from '../plugin/AddToCart'
import { addToWishlist } from '../plugin/addToWishlist'
import CartID from '../plugin/cartID'
import GetCurrentAddress from '../plugin/UserCountry'
import UserData from '../plugin/UserData'

function Shop() {
    const [products, setProduct] = useState([])
    const [vendor, setVendor] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedColors, setSelectedColors] = useState({})
    const [selectedSizes, setSelectedSizes] = useState({})
    const [colorImage, setColorImage] = useState('')
    const [colorValue, setColorValue] = useState('No Color')
    const [sizeValue, setSizeValue] = useState('No Size')
    const [qtyValue, setQtyValue] = useState(1)
    const [variationOpen, setVariationOpen] = useState(false)
    const [loadingStates, setLoadingStates] = useState({})

    const [cartCount, setCartCount] = useContext(CartContext)

    const axios = apiInstance
    const currentAddress = GetCurrentAddress()
    const userData = UserData()
    let cart_id = CartID()
    const param = useParams()
    
    if (UserData()?.vendor_id === 0) {
        window.location.href = '/vendor/register/'
    }

    useEffect(() => {
        axios.get(`vendor-products/${param?.slug}/`).then((res) => {
            setProduct(res.data);
        })
    }, [param])

    useEffect(() => {
        axios.get(`shop/${param?.slug}/`).then((res) => {
            setVendor(res.data);
            console.log(res.data);
        })
    }, [param])


    const handleColorSelect = (productId, colorName, colorPreview) => {
        setColorValue(colorName)
        setColorImage(colorPreview)
        setSelectedProduct(productId)
        setSelectedColors((prev) => ({
            ...prev,
            [productId]: colorName
        }))
    }

    const handleSizeSelect = (productId, sizeName) => {
        setSizeValue(sizeName)
        setSelectedProduct(productId)
        setSelectedSizes((prev) => ({
            ...prev,
            [productId]: sizeName
        }))
    }

    const handleQtyChange = (value, productId) => {
        setQtyValue(value)
        setSelectedProduct(productId)
    }


    const handleAddToCart = async (product_id, price, shipping_amount) => {
        setLoadingStates((prevStates) => ({
            ...prevStates,
            [product_id]: 'Adding...',
        }));


        try {
            const quantity = Number(qtyValue) > 0 ? Number(qtyValue) : 1

            await addToCart(
                product_id,
                userData?.user_id,
                quantity,
                price,
                shipping_amount,
                currentAddress.country,
                colorValue,
                sizeValue,
                cart_id,
                undefined
            )

            // After a successful operation, set the loading state to false
            setLoadingStates((prevStates) => ({
                ...prevStates,
                [product_id]: 'Added to Cart',
            }));



            setColorValue("No Color");
            setSizeValue("No Size");
            setQtyValue(1)
            setVariationOpen(false)

            const url = userData?.user_id ? `cart-list/${cart_id}/${userData?.user_id}/` : `cart-list/${cart_id}/`;
            const response = await axios.get(url);

            setCartCount(response.data.length);
            console.log(response.data.length);


        } catch (error) {
            console.log(error);

            // In case of an error, set the loading state for the specific product back to "Add to Cart"
            setLoadingStates((prevStates) => ({
                ...prevStates,
                [product_id]: 'Add to Cart',
            }));
        }


    };


    const handleAddToWishlist = async (product_id) => {
        try {
            await addToWishlist(product_id, userData?.user_id)
        } catch (error) {
            console.log(error);
        }
    };


    const renderAddToCartLabel = (productId) => {
        if (loadingStates[productId] === 'Added to Cart') {
            return (
                <>
                    Added to Cart
                    <Check className="ml-2 h-4 w-4" />
                </>
            )
        }

        if (loadingStates[productId] === 'Adding...') {
            return (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding to Cart
                </>
            )
        }

        return (
            <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </>
        )
    }

    const formatCurrency = (value) => {
        if (value === null || value === undefined) {
            return '$0.00'
        }

        const numberValue = Number(value)
        if (Number.isNaN(numberValue)) {
            return '$0.00'
        }

        return `$${numberValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    return (
        <main className="bg-slate-50 py-12">
            <div className="mx-auto w-full max-w-6xl px-4">
                <section className="flex flex-col items-center gap-5 text-center">
                    <div className="h-28 w-28 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                        <img
                            src={colorImage && selectedProduct ? colorImage : vendor.image}
                            alt={vendor.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-slate-900">{vendor.name}</h1>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            {vendor.description}
                        </p>
                    </div>
                    <Badge variant="secondary" className="text-sm font-medium">
                        {products?.length || 0} Product(s)
                    </Badge>
                </section>

                <section className="mt-10">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => {
                            const hasVariations = (product?.color && product.color.length > 0) || (product?.size && product.size.length > 0)
                            const isSelectedProduct = selectedProduct === product.id
                            const productImage = isSelectedProduct && colorImage ? colorImage : product.image

                            return (
                                <Card key={product.id} className="flex h-full flex-col border-0 shadow-sm">
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <Link to={`/detail/${product.slug}`} className="block">
                                            <img
                                                src={productImage}
                                                alt={product.title}
                                                className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </Link>
                                        <Badge className="absolute left-4 top-4 bg-primary text-primary-foreground">
                                            New
                                        </Badge>
                                    </div>
                                    <CardHeader className="space-y-3">
                                        <CardTitle className="text-lg font-semibold text-slate-900">
                                            <Link to={`/detail/${product.slug}`} className="hover:text-primary">
                                                {product.title?.length > 50
                                                    ? `${product.title.slice(0, 50)}...`
                                                    : product.title}
                                            </Link>
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            <Link to="/" className="transition-colors hover:text-primary">
                                                {product?.brand?.title}
                                            </Link>
                                        </p>
                                    </CardHeader>
                                    <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">Price</span>
                                            <span className="text-lg font-semibold text-primary">
                                                {formatCurrency(product.price)}
                                            </span>
                                        </div>

                                        {hasVariations ? (
                                            <Dialog
                                                open={variationOpen && selectedProduct === product.id}
                                                onOpenChange={(open) => {
                                                    setVariationOpen(open)
                                                    setSelectedProduct(open ? product.id : null)
                                                    if (open) {
                                                        setQtyValue(1)
                                                    }
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-center">
                                                        Choose Options
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-lg">
                                                    <DialogHeader>
                                                        <DialogTitle>Select variations</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-16 w-16 overflow-hidden rounded-md border">
                                                                <img
                                                                    src={productImage}
                                                                    alt={product.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium text-slate-900">{product.title}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Shipping: {formatCurrency(product.shipping_amount)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Separator />

                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-slate-900" htmlFor={`quantity-${product.id}`}>
                                                                Quantity
                                                            </label>
                                                            <Input
                                                                id={`quantity-${product.id}`}
                                                                type="number"
                                                                min={1}
                                                                value={selectedProduct === product.id ? qtyValue : 1}
                                                                onChange={(event) => handleQtyChange(Number(event.target.value), product.id)}
                                                            />
                                                        </div>

                                                        {product?.size && product.size.length > 0 && (
                                                            <div className="space-y-3">
                                                                <p className="text-sm font-medium text-slate-900">
                                                                    Size: {selectedSizes[product.id] || 'Select a size'}
                                                                </p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {product.size.map((size) => {
                                                                        const isActive = selectedSizes[product.id] === size.name
                                                                        return (
                                                                            <Button
                                                                                key={size.id || size.name}
                                                                                type="button"
                                                                                variant={isActive ? 'default' : 'outline'}
                                                                                size="sm"
                                                                                className={cn('uppercase')}
                                                                                onClick={() => handleSizeSelect(product.id, size.name)}
                                                                            >
                                                                                {size.name}
                                                                            </Button>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {product?.color && product.color.length > 0 && (
                                                            <div className="space-y-3">
                                                                <p className="text-sm font-medium text-slate-900">
                                                                    Color: {selectedColors[product.id] || 'Select a color'}
                                                                </p>
                                                                <div className="flex flex-wrap gap-3">
                                                                    {product.color.map((color) => {
                                                                        const isActive = selectedColors[product.id] === color.name
                                                                        return (
                                                                            <button
                                                                                key={color.id || color.name}
                                                                                type="button"
                                                                                onClick={() => handleColorSelect(product.id, color.name, color.image)}
                                                                                className={cn(
                                                                                    'flex h-10 w-10 items-center justify-center rounded-full border transition-shadow',
                                                                                    isActive
                                                                                        ? 'border-primary shadow-[0_0_0_2px_rgba(59,130,246,0.4)]'
                                                                                        : 'border-slate-200'
                                                                                )}
                                                                                style={{ backgroundColor: color.color_code }}
                                                                            >
                                                                                <span className="sr-only">{color.name}</span>
                                                                            </button>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex flex-col gap-3 sm:flex-row">
                                                            <Button
                                                                className="w-full"
                                                                onClick={() => handleAddToCart(product.id, product.price, product.shipping_amount)}
                                                                disabled={loadingStates[product.id] === 'Adding...'}
                                                            >
                                                                {renderAddToCartLabel(product.id)}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                                className="w-full"
                                                                onClick={() => handleAddToWishlist(product.id)}
                                                            >
                                                                <Heart className="mr-2 h-4 w-4" />
                                                                Add to Wishlist
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <div className="flex flex-col gap-3 sm:flex-row">
                                                <Button
                                                    className="w-full"
                                                    onClick={() => handleAddToCart(product.id, product.price, product.shipping_amount)}
                                                    disabled={loadingStates[product.id] === 'Adding...'}
                                                >
                                                    {renderAddToCartLabel(product.id)}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="w-full sm:w-auto"
                                                    onClick={() => handleAddToWishlist(product.id)}
                                                >
                                                    <Heart className="mr-2 h-4 w-4" />
                                                    Add to Wishlist
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>Shipping: {formatCurrency(product.shipping_amount)}</span>
                                        <span>SKU: {product.sku || 'N/A'}</span>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </section>
            </div>
        </main>

    )
}

export default Shop
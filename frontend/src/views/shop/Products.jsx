import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaShoppingCart, FaSpinner, FaHeart } from 'react-icons/fa';

import apiInstance from '../../utils/axios';
import Addon from '../plugin/Addon';
import GetCurrentAddress from '../plugin/UserCountry';
import UserData from '../plugin/UserData';
import CartID from '../plugin/cartID';
import { addToCart } from '../plugin/AddToCart';
import { addToWishlist } from '../plugin/addToWishlist';
import { CartContext } from '../plugin/Context';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProductCardSkeleton, CategorySkeleton } from '@/components/ui/product-skeleton';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

function Products() {

    const [featuredProducts, setFeaturedProducts] = useState([])
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const [brand, setBrand] = useState([])


    let [isAddingToCart, setIsAddingToCart] = useState("Add To Cart");
    const [loadingStates, setLoadingStates] = useState({});
    let [loading, setLoading] = useState(true);

    const axios = apiInstance
    const addon = Addon()
    const currentAddress = GetCurrentAddress()
    const userData = UserData()
    let cart_id = CartID()

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedColors, setSelectedColors] = useState({});
    const [selectedSize, setSelectedSize] = useState({});
    const [colorImage, setColorImage] = useState("")
    const [colorValue, setColorValue] = useState("No Color")
    const [sizeValue, setSizeValue] = useState("No Size")
    const [qtyValue, setQtyValue] = useState(1)
    let [cartCount, setCartCount] = useContext(CartContext);

    // Pagination
    // Define the number of items to be displayed per page
    const itemsPerPage = 6;

    // State hook to manage the current page being displayed
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the last item on the current page
    const indexOfLastItem = currentPage * itemsPerPage;

    // Calculate the index of the first item on the current page
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Extract a subset of items (current page) from the products array
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate the total number of pages needed based on the total number of items
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Generate an array of page numbers for pagination control
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    // Explanation:
    // - `indexOfLastItem` and `indexOfFirstItem` are used to determine the range of items
    //   to be displayed on the current page.
    // - `currentItems` holds the subset of products to be displayed on the current page.
    // - `totalPages` calculates the total number of pages required based on the total number
    //   of items and the specified items per page.
    // - `pageNumbers` is an array containing the page numbers from 1 to the total number of pages.
    //   It's often used for generating pagination controls or navigation.


    // Define an async function for fetching data from an API endpoint and updating the state.
    // This function takes two parameters:
    // - endpoint: The API endpoint to fetch data from.
    // - setDataFunction: The state update function to set the retrieved data.
    async function fetchData(endpoint, setDataFunction) {
        try {
            // Send an HTTP GET request to the provided endpoint using Axios.
            const response = await axios.get(endpoint);

            // If the request is successful, update the state with the retrieved data.
            setDataFunction(response.data);
            if (products) {
                setLoading(false)
            }
        } catch (error) {
            // If an error occurs during the request, log the error to the console.
            console.log(error);
        }
    }

    // Use the useEffect hook to execute code when the component mounts (empty dependency array).
    useEffect(() => {
        // Fetch and set the 'products' data by calling fetchData with the 'products/' endpoint.
        fetchData('products/', setProducts);

    }, []);

    // Use the useEffect hook to execute code when the component mounts (empty dependency array).
    useEffect(() => {
        // Fetch and set the 'products' data by calling fetchData with the 'products/' endpoint.
        fetchData('featured-products/', setFeaturedProducts);
    }, []);

    // Use another useEffect hook to execute code when the component mounts (empty dependency array).
    useEffect(() => {
        // Fetch and set the 'category' data by calling fetchData with the 'category/' endpoint.
        fetchData('category/', setCategory);
    }, []);

    // Fetch and set the 'brand' data by calling fetchData with the 'brand/' endpoint.

    useEffect(() => {
        // Fetch and set the 'category' data by calling fetchData with the 'category/' endpoint.
        fetchData('brand/', setBrand);
    }, []);



    const handleColorButtonClick = (event, product_id, colorName, colorImage) => {
        setColorValue(colorName);
        setColorImage(colorImage);
        setSelectedProduct(product_id);

        setSelectedColors((prevSelectedColors) => ({
            ...prevSelectedColors,
            [product_id]: colorName,
        }));


    };

    const handleSizeButtonClick = (event, product_id, sizeName) => {
        setSizeValue(sizeName);
        setSelectedProduct(product_id);

        setSelectedSize((prevSelectedSize) => ({
            ...prevSelectedSize,
            [product_id]: sizeName,
        }));

    };

    const handleQtyChange = (event, product_id) => {
        setQtyValue(event.target.value);
        setSelectedProduct(product_id);
    };


    const handleAddToCart = async (product_id, price, shipping_amount) => {
        setLoadingStates((prevStates) => ({
            ...prevStates,
            [product_id]: 'Đang Thêm...',
        }));


        try {
            await addToCart(product_id, userData?.user_id, qtyValue, price, shipping_amount, currentAddress.country, colorValue, sizeValue, cart_id, setIsAddingToCart)

            // After a successful operation, set the loading state to false
            setLoadingStates((prevStates) => ({
                ...prevStates,
                [product_id]: 'Đã Thêm Giỏ Hàng',
            }));



            setColorValue("No Color");
            setSizeValue("No Size");
            setQtyValue(0)

            const url = userData?.user_id ? `cart-list/${cart_id}/${userData?.user_id}/` : `cart-list/${cart_id}/`;
            const response = await axios.get(url);

            setCartCount(response.data.length);
            console.log(response.data.length);


        } catch (error) {
            console.log(error);

            // In case of an error, set the loading state for the specific product back to "Add to Cart"
            setLoadingStates((prevStates) => ({
                ...prevStates,
                [product_id]: 'Thêm Giỏ Hàng',
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


    return (
        <>
            {loading === false &&
                <div>
                    <main className="mt-5">
                        <div className="mx-auto max-w-6xl px-4">
                            <section className="text-center">
                                <div className="mx-auto mb-6 mt-4 max-w-2xl space-y-2">
                                    <h1 className="text-3xl font-semibold text-slate-900">Sản Phẩm Nổi Bật 📍</h1>
                                    <p className="text-base text-muted-foreground">
                                        Sản phẩm tiêu biểu mà người dùng yêu thích gần đây.
                                    </p>
                                </div>
                            </section>
                            <section className="text-center">
                                <div className={`grid gap-4 justify-items-center ${
                                    currentItems.length === 1 ? 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1' :
                                    currentItems.length === 2 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' :
                                    currentItems.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                                    currentItems.length === 4 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :
                                    currentItems.length === 5 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' :
                                    'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
                                }`}>
                                    {currentItems.map((product, index) => (
                                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow relative w-full max-w-[200px]">
                                            {/* Wishlist Button */}
                                            <Button
                                                onClick={() => handleAddToWishlist(product.id)}
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 left-2 z-10"
                                            >
                                                <FaHeart />
                                            </Button>
                                            
                                            <Link to={`/detail/${product.slug}`} className="block relative group">
                                                <img
                                                    src={(selectedProduct === product.id && colorImage) ? colorImage : product.image}
                                                    alt={product.title}
                                                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {product.featured && (
                                                    <Badge className="absolute top-2 right-2" variant="destructive">
                                                        Nổi bật
                                                    </Badge>
                                                )}
                                            </Link>
                                            <CardContent className="p-4">
                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        By: <Link to={`/vendor/${product?.vendor?.slug}`} className="hover:underline">{product.vendor.name}</Link>
                                                    </p>
                                                    <Link to={`/detail/${product.slug}`} className="block">
                                                        <h5 className="font-semibold text-lg hover:text-primary transition-colors">
                                                            {product.title.slice(0, 30)}...
                                                        </h5>
                                                    </Link>
                                                    <Badge variant="secondary">{product?.brand.title}</Badge>
                                                    <p className="text-xl font-bold text-primary">${product.price}</p>
                                                </div>

                                                {((product.color && product.color.length > 0) || (product.size && product.size.length > 0)) ? (
                                                    <div className="mt-4">
                                                        <details className="group">
                                                            <summary className="cursor-pointer list-none">
                                                                <Button variant="outline" className="w-full">
                                                                    Biến Thể
                                                                </Button>
                                                            </summary>
                                                            <div className="mt-2 space-y-4 rounded-lg border p-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-sm font-medium">Số lượng</label>
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="Số lượng"
                                                                        onChange={(e) => handleQtyChange(e, product.id)}
                                                                        min={1}
                                                                        defaultValue={1}
                                                                    />
                                                                </div>

                                                                {product?.size && product?.size.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        <p className="text-sm font-medium">
                                                                            <span className="font-semibold">Kích Cỡ:</span> {selectedSize[product.id] || 'Chọn kích cỡ'}
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {product?.size?.map((size, index) => (
                                                                                <Button
                                                                                    key={index}
                                                                                    variant={selectedSize[product.id] === size.name ? 'default' : 'outline'}
                                                                                    size="sm"
                                                                                    onClick={(e) => handleSizeButtonClick(e, product.id, size.name)}
                                                                                >
                                                                                    {size.name}
                                                                                </Button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {product.color && product.color.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        <p className="text-sm font-medium">
                                                                            <span className="font-semibold">Màu Sắc:</span> {selectedColors[product.id] || 'Chọn màu sắc'}
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {product?.color?.map((color, index) => (
                                                                                <button
                                                                                    key={index}
                                                                                    className={`h-10 w-10 rounded-full border-2 transition-all ${
                                                                                        selectedColors[product.id] === color.name
                                                                                            ? 'ring-2 ring-primary ring-offset-2'
                                                                                            : 'hover:scale-110'
                                                                                    }`}
                                                                                    style={{ backgroundColor: color.color_code }}
                                                                                    onClick={(e) => handleColorButtonClick(e, product.id, color.name, color.image)}
                                                                                    title={color.name}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <Button
                                                                    onClick={() => handleAddToCart(product.id, product.price, product.shipping_amount)}
                                                                    disabled={loadingStates[product.id] === 'Đang Thêm...'}
                                                                    className="w-full"
                                                                >
                                                                    {loadingStates[product.id] === 'Đã Thêm Giỏ Hàng' ? (
                                                                        <>
                                                                            Đã Thêm <FaCheckCircle className="ml-2" />
                                                                        </>
                                                                    ) : loadingStates[product.id] === 'Đang Thêm...' ? (
                                                                        <>
                                                                            Đang Thêm <FaSpinner className="ml-2 animate-spin" />
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {loadingStates[product.id] || 'Thêm Giỏ Hàng'} <FaShoppingCart className="ml-2" />
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </details>
                                                    </div>
                                                ) : (
                                                    <div className="mt-4">
                                                        <Button
                                                            onClick={() => handleAddToCart(product.id, product.price, product.shipping_amount)}
                                                            disabled={loadingStates[product.id] === 'Đang Thêm...'}
                                                            className="w-full"
                                                        >
                                                            {loadingStates[product.id] === 'Đã Thêm Giỏ Hàng' ? (
                                                                <>
                                                                    Đã Thêm <FaCheckCircle className="ml-2" />
                                                                </>
                                                            ) : loadingStates[product.id] === 'Đang Thêm...' ? (
                                                                <>
                                                                    Đang Thêm <FaSpinner className='ml-2 animate-spin' />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {loadingStates[product.id] || 'Thêm Giỏ Hàng'} <FaShoppingCart className="ml-2" />
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                            
                            {/* Pagination with shadcn */}
                            <Pagination className="mt-8">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>
                                    
                                    {pageNumbers.map((number) => (
                                        <PaginationItem key={number}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(number)}
                                                isActive={currentPage === number}
                                                className="cursor-pointer"
                                            >
                                                {number}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    
                                    <PaginationItem>
                                        <PaginationNext 
                                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                            <div className="text-center mt-6 space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Trang <span className="font-semibold">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
                                </p>
                                {totalPages !== 1 && (
                                    <p className="text-sm text-muted-foreground">
                                        Hiển thị <span className="font-semibold">{itemsPerPage}</span> / <span className="font-semibold">{products?.length}</span> sản phẩm
                                    </p>
                                )}
                            </div>
                            {/*Section: Wishlist*/}
                        </div>
                    </main>

                    <main className="mt-12">
                        <section className="text-center container">
                            <div className="max-w-2xl mx-auto mb-8">
                                <h1 className="text-3xl font-light mb-3">Danh mục</h1>
                            </div>
                        </section>
                        <div className="flex justify-center gap-4 flex-wrap">
                            {category.map((c, index) => (
                                <Link 
                                    key={index}
                                    to={`/category/${c.slug}`}
                                    className="flex flex-col items-center bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl p-8 min-w-[120px]"
                                >
                                    <img 
                                        src={c.image}
                                        alt={c.title}
                                        className="w-20 h-20 object-cover rounded-full"
                                    />
                                    <p className="text-gray-800 mt-2 font-medium">{c.title}</p>
                                </Link>
                            ))}
                        </div>
                    </main>
                </div>
            }

            {loading === true && (
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {[...Array(6)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            )}

            <ScrollToTop />
        </>
    )
}

export default Products
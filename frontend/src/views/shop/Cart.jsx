import { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

// Icons
import { FaCheckCircle, FaTrash, FaSync, FaShoppingCart, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

import { addToCart } from '../plugin/AddToCart';
import apiInstance from '../../utils/axios';
import GetCurrentAddress from '../plugin/UserCountry';
import UserData from '../plugin/UserData';
import CartID from '../plugin/cartID';
import { CartContext } from '../plugin/Context';

function Cart() {
    const [cart, setCart] = useState([])
    const [cartTotal, setCartTotal] = useState([])
    const [productQuantities, setProductQuantities] = useState({});
    let [isAddingToCart, setIsAddingToCart] = useState('')

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [cartCount, setCartCount] = useContext(CartContext);



    const axios = apiInstance
    const userData = UserData()
    let cart_id = CartID()
    const currentAddress = GetCurrentAddress()
    let navigate = useNavigate();

    // Get cart Items
    const fetchCartData = (cartId, userId) => {
        const url = userId ? `cart-list/${cartId}/${userId}/` : `cart-list/${cartId}/`;

        axios.get(url).then((res) => {
            setCart(res.data);
        });
    };

    // Get Cart Totals
    const fetchCartTotal = async (cartId, userId) => {
        const url = userId ? `cart-detail/${cartId}/${userId}/` : `cart-detail/${cartId}/`
        axios.get(url).then((res) => {
            setCartTotal(res.data);
        });
        // console.log(cartTotal);
    }

    useEffect(() => {
        console.log(cartTotal);
    }, [cartTotal]);

    if (cart_id !== null || cart_id !== undefined) {
        if (userData !== undefined) {
            useEffect(() => {
                fetchCartData(cart_id, userData.user_id);
                fetchCartTotal(cart_id, userData.user_id);
            }, []);
        } else {
            useEffect(() => {
                fetchCartData(cart_id, null);
                fetchCartTotal(cart_id, null);
            }, []);
        }
    } else {
        window.location.href("/");
    }


    useEffect(() => {
        const initialQuantities = {};
        cart.forEach((c) => {
            initialQuantities[c.product.id] = c.qty
        });
        setProductQuantities(initialQuantities);
    }, [cart]);

    const handleQtyChange = (event, product_id) => {
        const quantity = event.target.value;
        setProductQuantities((prevQuantities) => ({
            ...prevQuantities,
            [product_id]: quantity,
        }));
    };

    // Tính sub_total động dựa trên số lượng hiện tại
    const calculateSubTotal = (product_id, price) => {
        const qty = productQuantities[product_id] !== undefined ? productQuantities[product_id] : 1;
        return (price * qty).toFixed(2);
    };

    // Auto-update cart when quantity changes (debounced)
    const handleQtyChangeWithUpdate = async (event, cart_id, item_id, product_id, price, shipping_amount, color, size) => {
        const quantity = event.target.value;
        
        // Cập nhật state ngay lập tức
        setProductQuantities((prevQuantities) => ({
            ...prevQuantities,
            [product_id]: quantity,
        }));

        // Gọi API để cập nhật giỏ hàng
        if (quantity > 0) {
            try {
                await addToCart(product_id, userData?.user_id, quantity, price, shipping_amount, currentAddress.country, color, size, cart_id, isAddingToCart);
                fetchCartData(cart_id, userData?.user_id);
                fetchCartTotal(cart_id, userData?.user_id);
            } catch (error) {
                console.log(error);
            }
        }
    };



    const UpdateCart = async (cart_id, item_id, product_id, price, shipping_amount, color, size) => {
        const qtyValue = productQuantities[product_id];

        // console.log("cart_id:", cart_id);
        // console.log("item_id:", item_id);
        // console.log("qtyValue:", qtyValue);
        // console.log("product_id:", product_id);

        try {
            // Await the addToCart function
            await addToCart(product_id, userData?.user_id, qtyValue, price, shipping_amount, currentAddress.country, color, size, cart_id, isAddingToCart);

            // Fetch the latest cart data after addToCart is completed
            fetchCartData(cart_id, userData?.user_id)
            fetchCartTotal(cart_id, userData?.user_id)

        } catch (error) {
            // Handle error, e.g., display an error message
            console.log(error);
        }
    };

    // Remove Item From Cart
    const handleDeleteClick = async (cartId, itemId) => {
        const url = userData?.user_id
            ? `cart-delete/${cartId}/${itemId}/${userData.user_id}/`
            : `cart-delete/${cartId}/${itemId}/`;

        try {
            await axios.delete(url);
            // Add any additional logic or state updates after successful deletion
            fetchCartData(cart_id, userData?.user_id)
            fetchCartTotal(cart_id, userData?.user_id)

            const cart_url = userData?.user_id ? `cart-list/${cart_id}/${userData?.user_id}/` : `cart-list/${cart_id}/`;
            const response = await axios.get(cart_url);

            setCartCount(response.data.length);

        } catch (error) {
            console.error('Error deleting item:', error);
            // Handle errors or update state accordingly
        }
    };



    // Shipping Details
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Use computed property names to dynamically set the state based on input name
        switch (name) {
            case 'fullName':
                setFullName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'mobile':
                setMobile(value);
                break;
            case 'address':
                setAddress(value);
                break;
            case 'city':
                setCity(value);
                break;
            case 'state':
                setState(value);
                break;
            case 'country':
                setCountry(value);
                break;
            default:
                break;
        }
    };



    const createCartOrder = async () => {

        if (!fullName || !email || !mobile || !address || !city || !state || !country) {
            // If any required field is missing, show an error message or take appropriate action
            console.log("Please fill in all required fields");
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu Thông Tin!',
                text: "Vui lòng điền đầy đủ thông tin trước khi thanh toán",
            })
            return;
        }

        try {

            const formData = new FormData();
            formData.append('full_name', fullName);
            formData.append('email', email);
            formData.append('mobile', mobile);
            formData.append('address', address);
            formData.append('city', city);
            formData.append('state', state);
            formData.append('country', country);
            formData.append('cart_id', cart_id);
            formData.append('user_id', userData ? userData.user_id : 0);

            const response = await axios.post('create-order/', formData)
            console.log(response.data.order_oid);

            navigate(`/checkout/${response.data.order_oid}`);

        } catch (error) {
            console.log(error);
        }
    }





    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-light mb-2">Giỏ Hàng Của Bạn</h1>
                    <p className="text-muted-foreground">Xem lại đơn hàng và tiến hành thanh toán</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Sản Phẩm ({cart.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {cart.map((c, index) => (
                                    <div key={c.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                                                        {/* Product Image */}
                                                        <Link to={`/detail/${c?.product?.slug}`} className="flex-shrink-0">
                                                            <img
                                                                src={c?.product?.image}
                                                                alt={c?.product?.title}
                                                                className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition-transform"
                                                            />
                                                        </Link>

                                                        {/* Product Details */}
                                                        <div className="flex-grow">
                                                            <Link to={`/detail/${c.product.slug}`} className="font-semibold text-lg hover:text-primary transition-colors block mb-2">
                                                                {c?.product?.title}
                                                            </Link>
                                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                                {c.size !== "No Size" && (
                                                                    <p>
                                                                        <span className="font-medium">Kích Cỡ:</span> {c.size}
                                                                    </p>
                                                                )}
                                                                {c.color !== "No Color" && (
                                                                    <p>
                                                                        <span className="font-medium">Màu Sắc:</span> {c.color}
                                                                    </p>
                                                                )}
                                                                <p>
                                                                    <span className="font-medium">Giá:</span> ${c.product.price}
                                                                </p>
                                                                <p>
                                                                    <span className="font-medium">Kho:</span> {c.product.stock_qty}
                                                                </p>
                                                                <p>
                                                                    <Badge variant="outline">{c.product.vendor.name}</Badge>
                                                                </p>
                                                            </div>
                                                            <Button
                                                                onClick={() => handleDeleteClick(cart_id, c.id)}
                                                                variant="destructive"
                                                                size="sm"
                                                                className="mt-3"
                                                            >
                                                                <FaTrash className="mr-2" />Xóa
                                                            </Button>
                                                        </div>

                                                        {/* Quantity and Price */}
                                                        <div className="flex flex-col items-end gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    type="number"
                                                                    id={`qtyInput-${c.product.id}`}
                                                                    className="w-20"
                                                                    onChange={(e) => handleQtyChangeWithUpdate(e, cart_id, c.id, c.product.id, c.product.price, c.product.shipping_amount, c.color, c.size)}
                                                                    value={productQuantities[c.product.id] !== undefined ? productQuantities[c.product.id] : c.qty}
                                                                    min={1}
                                                                />
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-2xl font-bold text-primary">${calculateSubTotal(c.product.id, c.product.price)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                            ))}

                                                {cart.length < 1 && (
                                                    <div className="text-center py-12">
                                                        <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
                                                        <h3 className="text-2xl font-semibold mb-2">Giỏ Hàng Của Bạn Đang Trống</h3>
                                                        <p className="text-muted-foreground mb-4">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                                                        <Link to='/'>
                                                            <Button>
                                                                <FaShoppingCart className="mr-2" /> Tiếp Tục Mua Sắm
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Shipping Information */}
                                        {cart.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-2xl">Thông Tin Giao Hàng</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {/* Personal Info */}
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                                                            <FaUser className="mr-2" /> Thông Tin Cá Nhân
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="text-sm font-medium mb-1 block">Họ và Tên</label>
                                                                <Input
                                                                    type="text"
                                                                    name='fullName'
                                                                    onChange={handleChange}
                                                                    value={fullName}
                                                                    placeholder="Nhập họ và tên"
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="text-sm font-medium mb-1 block">Email</label>
                                                                    <Input
                                                                        type="email"
                                                                        name='email'
                                                                        onChange={handleChange}
                                                                        value={email}
                                                                        placeholder="email@example.com"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-sm font-medium mb-1 block">Số Điện Thoại</label>
                                                                    <Input
                                                                        type="text"
                                                                        name='mobile'
                                                                        onChange={handleChange}
                                                                        value={mobile}
                                                                        placeholder="0123456789"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    {/* Shipping Address */}
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                                                            <FaMapMarkerAlt className="mr-2" /> Địa Chỉ Giao Hàng
                                                        </h3>

                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="text-sm font-medium mb-1 block">Địa Chỉ</label>
                                                                <Input
                                                                    type="text"
                                                                    name='address'
                                                                    onChange={handleChange}
                                                                    value={address}
                                                                    placeholder="Số nhà, tên đường"
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="text-sm font-medium mb-1 block">Thành Phố</label>
                                                                    <Input
                                                                        type="text"
                                                                        name='city'
                                                                        onChange={handleChange}
                                                                        value={city}
                                                                        placeholder="Thành phố"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-sm font-medium mb-1 block">Tỉnh/Thành</label>
                                                                    <Input
                                                                        type="text"
                                                                        name='state'
                                                                        onChange={handleChange}
                                                                        value={state}
                                                                        placeholder="Tỉnh/Thành phố"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-sm font-medium mb-1 block">Quốc Gia</label>
                                                                <Input
                                                                    type="text"
                                                                    name='country'
                                                                    onChange={handleChange}
                                                                    value={country}
                                                                    placeholder="Việt Nam"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                    {/* Cart Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="text-2xl">Tóm Tắt Đơn Hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Tạm Tính</span>
                                        <span className="font-medium">${cartTotal.sub_total?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Phí Vận Chuyển</span>
                                        <span className="font-medium">${cartTotal.shipping?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Thuế</span>
                                        <span className="font-medium">${cartTotal.tax?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Phí Dịch Vụ</span>
                                        <span className="font-medium">${cartTotal.service_fee?.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Tổng Cộng</span>
                                    <span className="text-primary">${cartTotal.total?.toFixed(2)}</span>
                                </div>
                                
                                {cart.length > 0 && (
                                    <Button
                                        onClick={createCartOrder}
                                        className="w-full py-6 text-lg"
                                        size="lg"
                                    >
                                        <FaCheckCircle className="mr-2" />
                                        Tiến Hành Thanh Toán
                                    </Button>
                                )}
                                
                                <Link to="/">
                                    <Button variant="outline" className="w-full">
                                        <FaShoppingCart className="mr-2" />
                                        Tiếp Tục Mua Sắm
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <ScrollToTop />
        </div>
    )
}

export default Cart
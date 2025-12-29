import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2'
import { API_BASE_URL, PAYPAL_CLIENT_ID, SERVER_URL } from '../../utils/constants';
import { FaUser, FaMapMarkerAlt, FaCheckCircle, FaSpinner, FaCreditCard, FaLock, FaTruck } from 'react-icons/fa';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

import apiInstance from '../../utils/axios';
import GetCurrentAddress from '../plugin/UserCountry';
import UserData from '../plugin/UserData';
import CartID from '../plugin/cartID';



function Checkout() {
  const [order, setOrder] = useState([])
  const [couponCode, setCouponCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  const axios = apiInstance
  const userData = UserData()
  let cart_id = CartID()
  const param = useParams()
  let navigate = useNavigate();

  const computed = (order) => {
    const items = Array.isArray(order?.orderitem) ? order.orderitem : []
    const sum = (key) => items.reduce((acc, it) => acc + Number(it?.[key] || 0), 0)

    const sub_total = Number(order?.sub_total ?? 0) || sum('sub_total')
    const shipping_amount = Number(order?.shipping_amount ?? 0) || sum('shipping_amount')
    const tax_fee = Number(order?.tax_fee ?? 0) || sum('tax_fee')
    const service_fee = Number(order?.service_fee ?? 0) || sum('service_fee')
    const total = Number(order?.total ?? 0) || sum('total')

    return { sub_total, shipping_amount, tax_fee, service_fee, total }
  }



  useEffect(() => {
    axios.get(`checkout/${param?.order_oid}/`).then((res) => {
      setOrder(res.data);
    })
  }, [loading])


  const initialOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    switch (name) {
      case "couponCode":
        setCouponCode(value)
        break;

      default:
        break;
    }
  }

  const appleCoupon = async () => {
    console.log(couponCode);
    setLoading(true)

    const formdata = new FormData()
    formdata.append("order_oid", order.oid)
    formdata.append("coupon_code", couponCode)

    try {
      const response = await axios.post('coupon/', formdata)
      console.log(response.data);
      if (response.data.message === "Coupon Activated") {
        setLoading(false)

        Swal.fire({
          icon: 'success',
          title: response.data.message,
          text: "Mã giảm giá đã được áp dụng cho đơn hàng của bạn",
        })
      }

      if (response.data.message === "Coupon Already Activated") {
        setLoading(false)

        Swal.fire({
          icon: 'warning',
          title: response.data.message,
          text: "Mã giảm giá này đã được sử dụng!",
        })
      }
      setCouponCode("")

    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false)
      Swal.fire({
        icon: 'error',
        title: error.response.data.message,
        text: "Mã giảm giá không tồn tại!",
      })
      setCouponCode("")

    }

  }

  const payWithStripe = (event) => {
    setPaymentLoading(true)
    event.target.form.submit();
  }

  const payOnDelivery = async () => {
    try {
      setPaymentLoading(true)
      await axios.post(`pay-on-delivery/${param?.order_oid}/`)
      navigate(`/payment-success/${order.oid}/?payment_method=cod`)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Không thể tạo thanh toán khi nhận hàng',
        text: error?.response?.data?.error || 'Vui lòng thử lại.',
      })
    } finally {
      setPaymentLoading(false)
    }
  }


  return (
    <div className=" bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light mb-2">Thanh Toán</h1>
          <p className="text-muted-foreground">Kiểm tra thông tin và hoàn tất đơn hàng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Information Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Shipping Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  Địa Chỉ Giao Hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertDescription>
                    <strong>Kiểm tra thông tin giao hàng trước khi thanh toán</strong>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">

                  <div>
                    <label className="text-sm font-medium mb-1 block">Họ và Tên</label>
                    <Input
                      type="text"
                      readOnly
                      value={order.full_name}
                      className="bg-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        type="text"
                        readOnly
                        value={order.email}
                        className="bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Số Điện Thoại</label>
                      <Input
                        type="text"
                        readOnly
                        value={order.mobile}
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Địa Chỉ</label>
                    <Input
                      type="text"
                      readOnly
                      value={order.address}
                      className="bg-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Thành Phố</label>
                      <Input
                        type="text"
                        readOnly
                        value={order.city}
                        className="bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Tỉnh/Thành</label>
                      <Input
                        type="text"
                        readOnly
                        value={order.state}
                        className="bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Quốc Gia</label>
                      <Input
                        type="text"
                        readOnly
                        value={order.country}
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked id="billingAddress" className="rounded" />
                    <label htmlFor="billingAddress" className="text-sm font-medium">
                      Địa chỉ thanh toán giống với địa chỉ giao hàng
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-2xl">Tóm Tắt Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tạm Tính</span>
                    <span className="font-medium">${computed(order).sub_total}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Phí Vận Chuyển</span>
                    <span className="font-medium">${computed(order).shipping_amount}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Thuế</span>
                    <span className="font-medium">${computed(order).tax_fee}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Phí Dịch Vụ</span>
                    <span className="font-medium">${computed(order).service_fee}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Tổng Cộng</span>
                  <span className="text-primary">${computed(order).total}</span>
                </div>

                <Separator />
                
                {/* Coupon Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mã Giảm Giá</label>
                  <div className="flex gap-2">
                    {loading === true ? (
                      <>
                        <Input
                          readOnly
                          value={couponCode}
                          name="couponCode"
                          type="text"
                          placeholder='Nhập mã giảm giá'
                          className="border-dashed"
                        />
                        <Button disabled size="icon">
                          <FaSpinner className="animate-spin" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Input
                          onChange={handleChange}
                          value={couponCode}
                          name="couponCode"
                          type="text"
                          placeholder='Nhập mã giảm giá'
                          className="border-dashed"
                        />
                        <Button onClick={appleCoupon} size="icon" variant="default">
                          <FaCheckCircle />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <Separator />

                {/* Payment Buttons */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FaLock className="mr-2" />
                    Phương Thức Thanh Toán
                  </h3>
                  
                  {/* Stripe Payment */}
                  {/* {paymentLoading === true ? (
                    <form action={`${API_BASE_URL}stripe-checkout/${param?.order_oid}/`} method='POST'>
                      <Button
                        onClick={payWithStripe}
                        type="submit"
                        className="w-full py-6 text-lg"
                        style={{ backgroundColor: "#635BFF" }}
                        disabled
                      >
                        <FaSpinner className="mr-2 animate-spin" />
                        Đang Xử Lý...
                      </Button>
                    </form>
                  ) : (
                    <form action={`${API_BASE_URL}stripe-checkout/${param?.order_oid}/`} method='POST'>
                      <Button
                        onClick={payWithStripe}
                        type="submit"
                        className="w-full py-6 text-lg"
                        style={{ backgroundColor: "#635BFF" }}
                      >
                        <FaCreditCard className="mr-2" />
                        Thanh Toán Qua Stripe
                      </Button>
                    </form>
                  )} */}

                  {/* PayPal Payment */}
                  {/* <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: order.total.toString()
                                }
                              }
                            ]
                          })
                        }}

                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            const name = details.payer.name.given_name;
                            const status = details.status;
                            const payapl_order_id = data.orderID;

                            console.log(status);
                            if (status === "COMPLETED") {
                              navigate(`/payment-success/${order.oid}/?payapl_order_id=${payapl_order_id}`)
                            }
                          })
                        }}
                    />
                  </PayPalScriptProvider> */}

                  {/* Pay on Delivery */}
                  <Button
                    onClick={payOnDelivery}
                    className="w-full py-6 text-lg"
                    style={{ backgroundColor: "#10b981" }}
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? (
                      <>
                        <FaSpinner className="mr-2 animate-spin" />
                        Đang Xử Lý...
                      </>
                    ) : (
                      <>
                        <FaTruck className="mr-2" />
                        Thanh Toán Khi Nhận Hàng
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <ScrollToTop />
    </div>
  )
}

export default Checkout
import { React, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2'
import { API_BASE_URL, PAYPAL_CLIENT_ID, SERVER_URL } from '../../utils/constants';


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


  return (
    <div>
      <main>
        <main className="mb-4 mt-4">
          <div className="container">
            {/* Section: Checkout form */}
            <section className="">
              <div className="row gx-lg-5">
                <div className="col-lg-8 mb-4 mb-md-0">
                  {/* Section: Biling details */}
                  <section className="">
                    <div className="alert alert-warning">
                      <strong>Kiểm Tra Thông Tin Giao Hàng &amp; Đơn Hàng </strong>
                    </div>
                    <form>
                      <h5 className="mb-4 mt-4">Địa chỉ giao hàng</h5>
                      {/* 2 column grid layout with text inputs for the first and last names */}
                      <div className="row mb-4">

                        <div className="col-lg-12">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="form6Example2">Họ và Tên</label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.full_name}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="form6Example2">Email</label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.email}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="form6Example2">Số Điện Thoại</label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.mobile}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="form6Example2">Địa Chỉ</label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.address}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="form6Example2">Thành Phố</label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.city}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="form6Example2">Tỉnh/Thành</label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.state}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="form6Example2">Quốc Gia</label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.country}
                            />
                          </div>
                        </div>
                      </div>


                      <h5 className="mb-4 mt-4">Địa chỉ thanh toán</h5>
                      <div className="form-check mb-2">
                        <input className="form-check-input me-2" type="checkbox" defaultValue="" id="form6Example8" defaultChecked="" />
                        <label className="form-check-label" htmlFor="form6Example8">
                          Giống với địa chỉ giao hàng
                        </label>
                      </div>
                    </form>
                  </section>
                  {/* Section: Biling details */}
                </div>
                <div className="col-lg-4 mb-4 mb-md-0">
                  {/* Section: Summary */}
                  <section className="shadow-4 p-4 rounded-5 mb-4">
                    <h5 className="mb-3">Tóm Tắt Giỏ Hàng</h5>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Tạm Tính </span>
                      <span>${order.sub_total}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Phí Vận Chuyển </span>
                      <span>${order.shipping_amount}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Thuế </span>
                      <span>${order.tax_fee}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Phí Dịch Vụ </span>
                      <span>${order.service_fee}</span>
                    </div>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between fw-bold mb-5">
                      <span>Tổng Cộng </span>
                      <span>${order.total}</span>
                    </div>

                    <div className="shadow p-3 d-flex mt-4 mb-4">
                      {loading === true &&
                        <>
                          <input readOnly value={couponCode} name="couponCode" type="text" className='form-control' style={{ border: "dashed 1px gray" }} placeholder='Enter Coupon Code' id="" />
                          <button disabled className='btn btn-success ms-1'><i className='fas fa-spinner fa-spin'></i></button>
                        </>
                      }

                      {loading === false &&
                        <>
                          <input onChange={handleChange} value={couponCode} name="couponCode" type="text" className='form-control' style={{ border: "dashed 1px gray" }} placeholder='Nhập Mã Giảm Giá' id="" />
                          <button onClick={appleCoupon} className='btn btn-success ms-1'><i className='fas fa-check-circle'></i></button>
                        </>
                      }
                    </div>

                    {paymentLoading === true &&
                      <form action={`${API_BASE_URL}stripe-checkout/${param?.order_oid}/`} method='POST'>
                        <button onClick={payWithStripe} type="submit" className="btn btn-primary btn-rounded w-100 mt-2" style={{ backgroundColor: "#635BFF" }}>Đang Xử Lý... <i className='fas fa-spinner fa-spin'></i> </button>
                      </form>
                    }

                    {paymentLoading === false &&
                      <form action={`${API_BASE_URL}stripe-checkout/${param?.order_oid}/`} method='POST'>
                        <button onClick={payWithStripe} type="submit" className="btn btn-primary btn-rounded w-100 mt-2" style={{ backgroundColor: "#635BFF" }}>Thanh Toán Ngay (Stripe)</button>
                      </form>
                    }

                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons className='mt-3'
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
                    </PayPalScriptProvider>

                    {/* <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Flutterwave)</button>
                    <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paystack)</button>
                    <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paypal)</button> */}
                  </section>
                </div>
              </div>
            </section>
          </div>
        </main>
      </main>
    </div>
  )
}

export default Checkout
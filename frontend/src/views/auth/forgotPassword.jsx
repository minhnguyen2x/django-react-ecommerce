import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiInstance from '../../utils/axios';
import Swal from 'sweetalert2'
import { FaKey, FaEnvelope, FaPaperPlane, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const axios = apiInstance
    const [searchParams] = useSearchParams();
    const otp = searchParams.get('otp');
    const uuid = searchParams.get('uuid');

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
        console.log(email);
    }


    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            const res = await axios.get(`user/password-reset/${email}/`);
            console.log(res.data);
            Swal.fire({
                icon: 'success',
                title: 'Email Đặt Lại Mật Khẩu Đã Được Gửi!',
                text: 'Vui lòng kiểm tra email của bạn để tiếp tục.',
            });
            setEmail('');
        } catch (error) {
            console.error(error);
            setErrorMessage('Không thể gửi email. Vui lòng kiểm tra địa chỉ email và thử lại.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className=" bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-[rgb(37,99,235)] rounded-full flex items-center justify-center">
                                <FaKey className="text-white text-2xl" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold">Quên Mật Khẩu</CardTitle>
                        <CardDescription>
                            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {errorMessage && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium flex items-center">
                                    <FaEnvelope className="mr-2 text-gray-500" />
                                    Địa Chỉ Email
                                </label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="example@email.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-6 text-lg bg-[rgb(37,99,235)] hover:bg-[rgb(29,78,216)]"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="mr-2 animate-spin" />
                                        Đang Xử Lý...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="mr-2" />
                                        Gửi Email Đặt Lại Mật Khẩu
                                    </>
                                )}
                            </Button>

                            {/* Back to Login Link */}
                            <div className="pt-4 border-t text-center">
                                <Link 
                                    to="/login" 
                                    className="text-[rgb(37,99,235)] hover:text-[rgb(29,78,216)] font-medium inline-flex items-center"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <ScrollToTop />
        </div>
    )
}

export default ForgotPassword
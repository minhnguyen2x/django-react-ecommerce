import { useEffect, useState } from 'react';
import { register } from '../../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { FaUserPlus, FaSpinner, FaUser, FaEnvelope, FaPhone, FaLock, FaSignInAlt, FaCheckCircle } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

function Register() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, []);

    const resetForm = () => {
        setFullname('');
        setEmail('');
        setPhone('');
        setPassword('');
        setPassword2('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        const { error } = await register(fullname, email, phone, password, password2);
        if (error) {
            // Chuyển đổi error messages sang tiếng Việt
            let errorMsg = '';
            if (typeof error === 'object') {
                if (error.password && Array.isArray(error.password)) {
                    const translatedErrors = error.password.map(err => {
                        if (err.includes('at least 8 characters')) {
                            return 'Mật khẩu quá ngắn. Phải chứa ít nhất 8 ký tự.';
                        } else if (err.includes('too common')) {
                            return 'Mật khẩu này quá phổ biến.';
                        } else if (err.includes('entirely numeric')) {
                            return 'Mật khẩu không được chỉ toàn số.';
                        } else if (err.includes('too similar')) {
                            return 'Mật khẩu quá giống với thông tin cá nhân.';
                        }
                        return err;
                    });
                    errorMsg = translatedErrors.join(' ');
                } else {
                    errorMsg = JSON.stringify(error);
                }
            } else {
                errorMsg = error;
            }
            setErrorMessage(errorMsg);
        } else {
            navigate('/');
            resetForm();
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-[rgb(37,99,235)] rounded-full flex items-center justify-center">
                                <FaUserPlus className="text-white text-2xl" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold">Đăng Ký Tài Khoản</CardTitle>
                        <CardDescription>
                            Tạo tài khoản mới để bắt đầu mua sắm
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {errorMessage && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name Input */}
                            <div className="space-y-2">
                                <label htmlFor="fullname" className="text-sm font-medium flex items-center">
                                    <FaUser className="mr-2 text-gray-500" />
                                    Họ và Tên
                                </label>
                                <Input
                                    type="text"
                                    id="fullname"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium flex items-center">
                                    <FaEnvelope className="mr-2 text-gray-500" />
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Phone Input */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium flex items-center">
                                    <FaPhone className="mr-2 text-gray-500" />
                                    Số Điện Thoại
                                </label>
                                <Input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="0123456789"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium flex items-center">
                                    <FaLock className="mr-2 text-gray-500" />
                                    Mật Khẩu
                                </label>
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password2" className="text-sm font-medium flex items-center">
                                    <FaCheckCircle className="mr-2 text-gray-500" />
                                    Xác Nhận Mật Khẩu
                                </label>
                                <Input
                                    type="password"
                                    id="password2"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                                {password2 && password2 !== password && (
                                    <p className="text-sm text-red-600 font-medium">
                                        Mật khẩu không khớp
                                    </p>
                                )}
                            </div>

                            {/* Register Button */}
                            <Button 
                                type="submit" 
                                disabled={isLoading || (password2 && password2 !== password)}
                                className="w-full py-6 text-lg bg-[rgb(37,99,235)] hover:bg-[rgb(29,78,216)]"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="mr-2 animate-spin" />
                                        Đang Xử Lý...
                                    </>
                                ) : (
                                    <>
                                        <FaUserPlus className="mr-2" />
                                        Đăng Ký
                                    </>
                                )}
                            </Button>

                            {/* Links */}
                            <div className="pt-4 border-t text-center text-sm">
                                <span className="text-gray-600">Đã có tài khoản? </span>
                                <Link 
                                    to="/login" 
                                    className="text-[rgb(37,99,235)] hover:text-[rgb(29,78,216)] font-semibold inline-flex items-center"
                                >
                                    <FaSignInAlt className="mr-1" />
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <ScrollToTop />
        </div>
    );
}

export default Register;

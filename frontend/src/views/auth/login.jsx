import { useEffect, useState } from 'react';
import { login } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaSpinner, FaEnvelope, FaLock, FaUserPlus, FaKey } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, []);

    const resetForm = () => {
        setUsername('');
        setPassword('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        const { error } = await login(username, password);
        if (error) {
            setErrorMessage(error);
        } else {
            navigate('/');
            resetForm();
        }
        setIsLoading(false);
    };
    return (
        <div className=" bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-[rgb(37,99,235)] rounded-full flex items-center justify-center">
                                <FaSignInAlt className="text-white text-2xl" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold">Đăng Nhập</CardTitle>
                        <CardDescription>
                            Nhập thông tin đăng nhập của bạn để tiếp tục
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {errorMessage && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium flex items-center">
                                    <FaEnvelope className="mr-2 text-gray-500" />
                                    Địa Chỉ Email
                                </label>
                                <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="example@email.com"
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
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Login Button */}
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
                                        <FaSignInAlt className="mr-2" />
                                        Đăng Nhập
                                    </>
                                )}
                            </Button>

                            {/* Links */}
                            <div className="space-y-3 text-center text-sm">
                                <div>
                                    <Link 
                                        to="/forgot-password" 
                                        className="text-red-600 hover:text-red-700 font-medium flex items-center justify-center"
                                    >
                                        <FaKey className="mr-2" />
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <div className="pt-4 border-t">
                                    <span className="text-gray-600">Chưa có tài khoản? </span>
                                    <Link 
                                        to="/register" 
                                        className="text-[rgb(37,99,235)] hover:text-[rgb(29,78,216)] font-semibold inline-flex items-center"
                                    >
                                        <FaUserPlus className="mr-1" />
                                        Đăng ký ngay
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <ScrollToTop />
        </div>
    );
};

export default Login;
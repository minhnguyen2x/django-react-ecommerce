import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

import apiInstance from '../../utils/axios'

function CreatePassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)

    const axios = apiInstance
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const otp = searchParams.get('otp')
    const uidb64 = searchParams.get('uidb64')
    const resetToken = searchParams.get('reset_token')

    const handlePasswordSubmit = async (event) => {
        event.preventDefault()

        if (password !== confirmPassword) {
            setError(true)
            return
        }

        setError(false)

        const formdata = new FormData()
        formdata.append('otp', otp)
        formdata.append('uidb64', uidb64)
        formdata.append('reset_token', resetToken)
        formdata.append('password', password)

        try {
            const response = await axios.post('user/password-change/', formdata)
            if (response.data?.code) {
                Swal.fire({ icon: 'success', title: 'Đổi mật khẩu thành công' })
                navigate('/login')
            }
        } catch (err) {
            console.error('Password change failed:', err)
            Swal.fire({ icon: 'error', title: 'Đã xảy ra lỗi. Vui lòng thử lại.' })
        }
    }

    return (
        <div className=" bg-slate-50">
            <ScrollToTop />
            <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-16">
                <Card className="shadow-sm">
                    <CardHeader className="space-y-2 text-center">
                        <CardTitle className="text-2xl font-semibold">Tạo mật khẩu mới</CardTitle>
                        <CardDescription>Nhập mật khẩu mới của bạn để hoàn tất quá trình đặt lại.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Mật khẩu mới</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="Nhập lại mật khẩu"
                                />
                                {error !== null && (
                                    <Alert variant={error ? 'destructive' : 'default'} className="mt-2">
                                        <AlertDescription>
                                            {error ? 'Mật khẩu không khớp. Vui lòng kiểm tra lại.' : 'Mật khẩu đã khớp.'}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <Button type="submit" className="w-full">
                                Đặt lại mật khẩu
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Nhớ mật khẩu rồi?{' '}
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                Đăng nhập
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default CreatePassword
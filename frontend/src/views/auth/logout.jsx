import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

import { logout } from '../../utils/auth'

const Logout = () => {
    useEffect(() => {
        logout()
    }, [])

    return (
        <div className=" bg-slate-50">
            <ScrollToTop />
            <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-24">
                <Card className="shadow-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold">Bạn đã đăng xuất</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <p className="text-center text-sm text-muted-foreground">
                            Đăng nhập lại để tiếp tục mua sắm hoặc tạo tài khoản mới nếu bạn chưa có.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                            <Button asChild className="gap-2">
                                <Link to="/login">
                                    <LogIn className="h-4 w-4" /> Đăng nhập
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="gap-2">
                                <Link to="/register">
                                    <UserPlus className="h-4 w-4" /> Đăng ký
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Logout
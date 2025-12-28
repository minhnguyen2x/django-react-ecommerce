import React, { useContext, useState, useEffect } from 'react'
import { useAuthStore } from '../../store/auth';
import { Link } from 'react-router-dom';
import { CartContext } from '../plugin/Context';
import apiInstance from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
    User, ShoppingCart, Bell, Settings, 
    Package, Plus, DollarSign, Star, Tag, 
    LayoutDashboard, LogOut, LogIn, UserPlus, 
    Search, ChevronDown, ShoppingBag 
} from 'lucide-react';


function StoreHeader() {
    const [cartCount, setCartCount] = useContext(CartContext)
    const [search, setSearch] = useState("")

    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    console.log("user().vendor_id", user().vendor_id);

    const navigate = useNavigate()

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        console.log(search);
    }

    const handleSearchSubmit = () => {
        navigate(`/search?query=${search}`)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-slate-900 text-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <ShoppingBag className="h-8 w-8" />
                        <span className="text-xl font-bold hidden sm:block">Sộp Pi</span>
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center gap-1">
                        {/* Tài Khoản Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-white hover:text-white hover:bg-[rgb(37,99,235)]">
                                    <User className="mr-2 h-4 w-4" />
                                    Tài Khoản
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link to="/customer/account/" className="flex items-center cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        Tài Khoản
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/customer/orders/" className="flex items-center cursor-pointer">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Đơn Hàng
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/customer/settings/" className="flex items-center cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Cài Đặt
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Người Bán Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-white hover:text-white hover:bg-[rgb(37,99,235)]">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Người Bán
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link to="/vendor/dashboard/" className="flex items-center cursor-pointer">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/vendor/products/" className="flex items-center cursor-pointer">
                                        <Package className="mr-2 h-4 w-4" />
                                        Sản Phẩm
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/vendor/product/new/" className="flex items-center cursor-pointer">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm Sản Phẩm
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/vendor/orders/" className="flex items-center cursor-pointer">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Đơn Hàng
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/vendor/earning/" className="flex items-center cursor-pointer">
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        Thu Nhập
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/vendor/settings/" className="flex items-center cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Cài Đặt
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                    {/* Search Bar */}
                    <div className="flex items-center gap-2 flex-1 max-w-xl">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={search}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearchSubmit} size="icon" variant="secondary">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Auth & Cart */}
                    <div className="flex items-center gap-2">
                        {isLoggedIn() ? (
                            <>
                                <Button asChild variant="ghost" className="hidden sm:flex text-white hover:bg-[rgb(37,99,235)]">
                                    <Link to="/customer/account/">
                                        <User className="mr-2 h-4 w-4" />
                                        Tài Khoản
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" className="text-white hover:bg-[rgb(37,99,235)]">
                                    <Link to="/logout">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Đăng Xuất</span>
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-[rgb(37,99,235)]">
                                    <Link to="/login">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Đăng Nhập</span>
                                    </Link>
                                </Button>
                                <Button asChild className="hidden sm:flex hover:text-white hover:bg-[rgb(37,99,235)]">
                                    <Link to="/register">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Đăng Ký
                                    </Link>
                                </Button>
                            </>
                        )}
                        
                        <Button asChild className="relative bg-[rgb(37,99,235)] text-white hover:bg-[rgb(29,78,216)]">
                            <Link to="/cart/">
                                <ShoppingCart className="h-4 w-4" />
                                {cartCount > 0 && (
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-sky-100 text-[rgb(37,99,235)] border-2 border-sky-100 font-semibold">
                                        {cartCount}
                                    </Badge>
                                )}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default StoreHeader
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, DollarSign, Star, PlusCircle, Tag, Bell, Settings, LogOut } from 'lucide-react'

import { cn } from '@/lib/utils'
import UserData from '../plugin/UserData'

const navItems = [
  { href: '/vendor/dashboard/', label: 'Bảng Điều Khiển', icon: LayoutDashboard },
  { href: '/vendor/products/', label: 'Sản Phẩm', icon: Package },
  { href: '/vendor/orders/', label: 'Đơn Hàng', icon: ShoppingCart },
  { href: '/vendor/earning/', label: 'Thu Nhập', icon: DollarSign },
  { href: '/vendor/product/new/', label: 'Thêm Sản Phẩm', icon: PlusCircle },
  { href: '/vendor/settings/', label: 'Cài Đặt', icon: Settings },
]

function Sidebar() {
  const location = useLocation()

  if (UserData()?.vendor_id === 0) {
    window.location.href = '/vendor/register/'
  }

  const isActiveLink = (path) => location.pathname.startsWith(path)

  return (
    <aside className="w-full bg-slate-900 text-slate-100 lg:w-64" role="navigation">
      <div className="flex h-full flex-col gap-6 px-4 py-8">
        <div>
          <h2 className="text-lg font-semibold uppercase tracking-wide text-slate-300">Cổng Nhà Bán</h2>
          <p className="text-sm text-slate-500">Quản lý cửa hàng của bạn ở một nơi</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white',
                isActiveLink(href) && 'bg-slate-800 text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-800 pt-4">
          <Link
            to="/logout"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng Xuất</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
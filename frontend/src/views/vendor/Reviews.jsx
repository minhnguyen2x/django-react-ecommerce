import React, { useEffect, useMemo, useState } from 'react'
import { Eye, MessageSquare, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import Sidebar from './Sidebar'

function Reviews() {
  const [reviews, setReviews] = useState([])

  const axios = apiInstance
  const userData = UserData()

  if (userData?.vendor_id === 0) {
    window.location.href = '/vendor/register/'
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`vendor-reviews/${userData?.vendor_id}/`)
      setReviews(response.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const hasReviews = useMemo(() => reviews.length > 0, [reviews])

  const renderStars = (count) =>
    Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={index < count ? 'h-4 w-4 fill-yellow-400 text-yellow-400' : 'h-4 w-4 text-slate-300'}
        strokeWidth={index < count ? 0 : 2}
      />
    ))

  return (
    <div className=" bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row">
        <Sidebar />
        <div className="flex-1 space-y-8">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900">Đánh Giá & Xếp Hạng</h1>
            <p className="text-sm text-muted-foreground">
              Theo dõi phản hồi của khách hàng và phản hồi để duy trì mối quan hệ tốt.
            </p>
          </header>

          <div className="space-y-4">
            {hasReviews ? (
              reviews.map((review) => (
                <Card key={review.id} className="border-0 shadow-sm">
                  <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-start">
                    <div className="flex items-center justify-center md:w-48">
                      <div className="h-32 w-32 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                        <img
                          src={review?.profile?.image}
                          alt={`${review?.profile?.full_name || 'Khách hàng'} avatar`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {review?.profile?.full_name || 'Khách hàng'}
                          </p>
                          <p className="text-sm text-muted-foreground">{review?.profile?.email || 'Không có email'}</p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          <MessageSquare className="mr-1 h-3.5 w-3.5" />
                          {review?.product?.title || 'Sản phẩm không rõ'}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">Đánh Giá</span>
                          <div className="flex items-center gap-1">
                            {renderStars(Number(review?.rating) || 0)}
                          </div>
                          <span className="text-xs text-muted-foreground">{review?.rating || 0}/5</span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-700">Nhận Xét</p>
                          <p className="text-sm leading-relaxed text-slate-600">{review?.review || 'Không có nhận xét.'}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-700">Phản Hồi Của Người Bán</p>
                          {review?.reply ? (
                            <p className="text-sm leading-relaxed text-slate-600">{review.reply}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Chưa có phản hồi.</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button asChild variant="outline">
                          <Link to={`/vendor/reviews/${review.id}/`}>
                            <Eye className="mr-2 h-4 w-4" /> Xem đánh giá
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Chưa có đánh giá</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Phản hồi của khách hàng sẽ xuất hiện ở đây khi khách hàng bắt đầu đánh giá sản phẩm của bạn.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reviews
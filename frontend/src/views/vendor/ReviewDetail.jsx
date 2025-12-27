import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, MessageSquare, Reply, Star } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import Sidebar from './Sidebar'

function ReviewDetail() {
    const [review, setReview] = useState(null)
    const [replyData, setReplyData] = useState({ reply: '' })
    const [isReplyOpen, setIsReplyOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const axios = apiInstance
    const userData = UserData()
    const params = useParams()

    if (userData?.vendor_id === 0) {
        window.location.href = '/vendor/register/'
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`vendor-reviews/${userData?.vendor_id}/${params.id}`)
            setReview(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleReplyChange = (event) => {
        setReplyData({ reply: event.target.value })
    }

    const handleReplySubmit = async (event) => {
        event.preventDefault()
        if (!replyData.reply?.trim()) {
            return
        }

        const formdata = new FormData()
        formdata.append('reply', replyData.reply)

        try {
            setIsSubmitting(true)
            await axios.patch(`vendor-reviews/${userData?.vendor_id}/${review?.id}/`, formdata)
            await fetchData()
            setReplyData({ reply: '' })
            setIsReplyOpen(false)
        } catch (error) {
            console.error('Error submitting reply:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStars = useMemo(
        () => (count) =>
            Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    className={index < count ? 'h-4 w-4 fill-yellow-400 text-yellow-400' : 'h-4 w-4 text-slate-300'}
                    strokeWidth={index < count ? 0 : 2}
                />
            )),
        []
    )

    const ratingValue = Number(review?.rating) || 0

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row">
                <Sidebar />
                <div className="flex-1 space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold text-slate-900">Review details</h1>
                            <p className="text-sm text-muted-foreground">
                                Inspect customer feedback and send a personalised response.
                            </p>
                        </div>
                        <Button asChild variant="ghost" className="text-slate-600">
                            <Link to="/vendor/reviews/">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to reviews
                            </Link>
                        </Button>
                    </div>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-900">
                                    {review?.profile?.full_name || 'Customer'}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">{review?.profile?.email || 'No email provided'}</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                <MessageSquare className="mr-1 h-3.5 w-3.5" />
                                {review?.product?.title || 'Unknown product'}
                            </Badge>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                                <div className="flex items-center justify-center md:w-48">
                                    <div className="h-40 w-40 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                                        <img
                                            src={review?.profile?.image}
                                            alt={`${review?.profile?.full_name || 'Customer'} avatar`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-700">Rating</span>
                                            <div className="flex items-center gap-1">{renderStars(ratingValue)}</div>
                                            <span className="text-xs text-muted-foreground">{ratingValue}/5</span>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-slate-700">Review</p>
                                            <p className="text-sm leading-relaxed text-slate-600">{review?.review || 'No review text provided.'}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-slate-700">Seller reply</p>
                                            {review?.reply ? (
                                                <p className="text-sm leading-relaxed text-slate-600">{review.reply}</p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No response yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50 p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="text-sm text-muted-foreground">
                                    {review?.reply ? 'Update your response' : 'Post a response to this review'}
                                </div>
                                <Button variant="outline" onClick={() => setIsReplyOpen((prev) => !prev)}>
                                    <Reply className="mr-2 h-4 w-4" />
                                    {isReplyOpen ? 'Cancel reply' : 'Write a reply'}
                                </Button>
                            </div>

                            {isReplyOpen && (
                                <form onSubmit={handleReplySubmit} className="space-y-4">
                                    <Textarea
                                        name="reply"
                                        value={replyData.reply}
                                        onChange={handleReplyChange}
                                        placeholder="Share helpful order updates, apologies, or thanks."
                                        rows={4}
                                    />
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Sending…' : 'Send reply'}
                                        </Button>
                                        <Button type="button" variant="ghost" onClick={() => setIsReplyOpen(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ReviewDetail
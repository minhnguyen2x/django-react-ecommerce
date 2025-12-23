import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-[300px]" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-20" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 rounded-lg">
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="h-4 w-24 mt-2" />
    </div>
  )
}

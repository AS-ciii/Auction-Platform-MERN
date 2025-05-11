import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock } from "lucide-react"

interface Auction {
  _id: string
  title: string
  description: string
  imageUrl: string
  currentPrice: number
  status: string
  endTime: string
  category: string
}

interface AuctionCardProps {
  auction: Auction
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const formatTimeLeft = (endTimeStr: string) => {
    const endTime = new Date(endTimeStr).getTime()
    const now = Date.now()

    if (endTime < now) {
      return "Ended"
    }

    const timeLeft = endTime - now
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}d ${hours}h left`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`
    } else {
      return `${minutes}m left`
    }
  }

  const getStatusBadge = (status: string, endTimeStr: string) => {
    const endTime = new Date(endTimeStr).getTime()
    const now = Date.now()

    if (endTime < now) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Ended
        </Badge>
      )
    }

    if (status === "active") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    }

    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
        Upcoming
      </Badge>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img
          src={auction.imageUrl}
          alt={auction.title}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{auction.title}</h3>
          {getStatusBadge(auction.status, auction.endTime)}
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{auction.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Current Bid</p>
            <p className="font-semibold">${auction.currentPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Time Left</p>
            <p className="font-semibold flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTimeLeft(auction.endTime)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" asChild>
          <Link href={`/auctions/${auction._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 
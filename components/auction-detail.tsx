"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Clock, DollarSign, User, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Bid {
  bidder: {
    _id: string
    name: string
  }
  amount: number
  time: string
}

interface Auction {
  _id: string
  title: string
  description: string
  startingPrice: number
  currentPrice: number
  imageUrl: string
  category: string
  startTime: string
  endTime: string
  seller: {
    _id: string
    name: string
  }
  status: "upcoming" | "active" | "ended"
  bids: Bid[]
}

export default function AuctionDetail({ auction: initialAuction }: { auction: Auction }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [auction, setAuction] = useState<Auction>(initialAuction)
  const [bidAmount, setBidAmount] = useState("")
  const [placingBid, setPlacingBid] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")
  const [countdown, setCountdown] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Set initial bid amount to minimum bid
    const minBid = auction.currentPrice + 10
    setBidAmount(minBid.toString())
  }, [auction])

  useEffect(() => {
    if (auction) {
      const updateTimeLeft = () => {
        const endTime = new Date(auction.endTime).getTime()
        const now = Date.now()

        if (endTime < now) {
          setTimeLeft("Auction has ended")
          if (countdown) {
            clearInterval(countdown)
          }
          return
        }

        const timeRemaining = endTime - now
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

        let timeStr = ""
        if (days > 0) {
          timeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`
        } else if (hours > 0) {
          timeStr = `${hours}h ${minutes}m ${seconds}s`
        } else {
          timeStr = `${minutes}m ${seconds}s`
        }

        setTimeLeft(timeStr)
      }

      updateTimeLeft()
      const interval = setInterval(updateTimeLeft, 1000)
      setCountdown(interval)

      return () => clearInterval(interval)
    }
  }, [auction])

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place a bid.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    const bidValue = Number.parseFloat(bidAmount)
    const minBid = auction.currentPrice + 10

    if (bidValue < minBid) {
      toast({
        title: "Bid Too Low",
        description: `Your bid must be at least $${minBid.toFixed(2)}.`,
        variant: "destructive",
      })
      return
    }

    setPlacingBid(true)

    try {
      const response = await fetch(`/api/auctions/${auction._id}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: bidValue }),
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to place bid")
      }

      const data = await response.json()
      setAuction(data.auction)

      toast({
        title: "Bid Placed Successfully",
        description: `You've placed a bid of $${bidValue.toFixed(2)}.`,
      })

      // Set new minimum bid
      setBidAmount((bidValue + 10).toString())
    } catch (error) {
      toast({
        title: "Error Placing Bid",
        description: error instanceof Error ? error.message : "There was an error placing your bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPlacingBid(false)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadge = () => {
    const endTime = new Date(auction.endTime).getTime()
    const startTime = new Date(auction.startTime).getTime()
    const now = Date.now()

    if (endTime < now) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Ended
        </Badge>
      )
    }

    if (startTime > now) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Upcoming
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="bg-green-100 text-green-800">
        Active
      </Badge>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/auctions">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Auctions
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="aspect-video overflow-hidden rounded-lg border">
            <img
              src={auction.imageUrl}
              alt={auction.title}
              className="h-full w-full object-cover"
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{auction.title}</CardTitle>
                {getStatusBadge()}
              </div>
              <CardDescription>{auction.category}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">Current Price: ${auction.currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">Time Left: {timeLeft}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-semibold">Seller: {auction.seller.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Place a Bid</CardTitle>
              <CardDescription>
                Minimum bid: ${(auction.currentPrice + 10).toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="number"
                    min={auction.currentPrice + 10}
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid amount"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={placingBid}
                >
                  {placingBid ? "Placing Bid..." : "Place Bid"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bid History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auction.bids.length === 0 ? (
                  <p className="text-muted-foreground">No bids yet</p>
                ) : (
                  auction.bids.map((bid, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div>
                        <p className="font-semibold">{bid.bidder.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(bid.time)}
                        </p>
                      </div>
                      <p className="font-semibold">${bid.amount.toFixed(2)}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
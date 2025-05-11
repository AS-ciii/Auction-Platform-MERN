import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

interface Auction {
  _id: string
  title: string
  currentPrice: number
  imageUrl: string
  endTime: string
  status: "upcoming" | "active" | "ended"
  bids: Array<{
    bidder: any
    amount: number
    time: Date
  }>
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login")
  }

  const { db } = await connectToDatabase()

  // Fetch all auctions
  const allAuctions = await db.collection("auctions")
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  // Fetch all auctions with at least one bid
  const allBids = await db.collection("auctions")
    .find({ "bids.0": { $exists: true } })
    .sort({ createdAt: -1 })
    .toArray()

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
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-8">
        <div className="container mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>All Auctions</CardTitle>
                <CardDescription>All auctions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {allAuctions.length === 0 ? (
                  <p className="text-muted-foreground">No auctions found.</p>
                ) : (
                  <div className="grid gap-4">
                    {allAuctions.map((auction) => (
                      <div key={auction._id.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{auction.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Current Price: ${auction.currentPrice}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {getStatusBadge(auction.status, auction.endTime)}
                            <Badge variant="outline">
                              {auction.bids?.length || 0} bids
                            </Badge>
                          </div>
                        </div>
                        <Button asChild variant="outline">
                          <Link href={`/auctions/${auction._id}`}>View Details</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Auctions With Bids</CardTitle>
                <CardDescription>Auctions that have at least one bid</CardDescription>
              </CardHeader>
              <CardContent>
                {allBids.length === 0 ? (
                  <p className="text-muted-foreground">No auctions with bids found.</p>
                ) : (
                  <div className="grid gap-4">
                    {allBids.map((auction) => {
                      const topBid = auction.bids?.[0]
                      return (
                        <div key={auction._id.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{auction.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Top Bid: ${topBid?.amount ?? 'N/A'}
                            </p>
                            <div className="flex gap-2 mt-2">
                              {getStatusBadge(auction.status, auction.endTime)}
                              <Badge variant="outline">
                                {auction.bids?.length || 0} bids
                              </Badge>
                            </div>
                          </div>
                          <Button asChild variant="outline">
                            <Link href={`/auctions/${auction._id}`}>View Details</Link>
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

import { MainNav } from "@/components/main-nav"
import AuctionDetail from "@/components/auction-detail"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function AuctionPage({ params }: PageProps) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      console.error("Invalid auction ID:", params.id)
      return notFound()
    }

    const connection = await connectToDatabase()
    if (!connection || !connection.db) {
      throw new Error("Database connection failed - no connection object returned")
    }

    const db = connection.db
    const auctionId = new ObjectId(params.id)

    const auction = await db.collection("auctions").findOne({ _id: auctionId })
    if (!auction) {
      console.error("Auction not found:", auctionId)
      return notFound()
    }

    if (!auction.sellerId) {
      console.error("Auction is missing 'sellerId' field:", auction)
      return notFound()
    }

    const sellerId = typeof auction.sellerId === "string"
      ? new ObjectId(auction.sellerId)
      : auction.sellerId

    const seller = await db.collection("users").findOne({ _id: sellerId })
    if (!seller) {
      console.error("Seller not found:", sellerId)
      return notFound()
    }

    // Ensure bids array exists
    if (!Array.isArray(auction.bids)) {
      auction.bids = []
    }

    // Serialize MongoDB ObjectId fields to strings manually
    const serializedAuction = {
      ...auction,
      _id: auction._id.toString(),
      seller: {
        _id: seller._id.toString(),
        name: seller.name || "Unnamed Seller"
      },
      bids: (auction.bids || []).map((bid: any) => ({
        ...bid,
        bidder: {
          _id: bid.bidder?._id?.toString() || "",
          name: bid.bidder?.name || "Unknown Bidder"
        }
      })),
      winner: auction.winnerId ? auction.winnerId.toString() : null,
      sellerId: auction.sellerId.toString(), // Manually serialize sellerId
      winnerId: auction.winnerId ? auction.winnerId.toString() : null // Manually serialize winnerId
    }

    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1">
          <AuctionDetail auction={serializedAuction} />
        </main>
      </div>
    )
  } catch (error) {
    console.error("Error in AuctionPage:", {
      error,
      params,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
}

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's active bids
    const activeBids = await db.collection("bids").countDocuments({
      userId: user._id,
      status: "active"
    })

    // Get user's won auctions
    const wonAuctions = await db.collection("auctions").countDocuments({
      winnerId: user._id,
      status: "ended"
    })

    // Get user's active auctions
    const activeAuctions = await db.collection("auctions").countDocuments({
      sellerId: user._id,
      status: "active"
    })

    return NextResponse.json({
      activeBids,
      wonAuctions,
      activeAuctions
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
} 
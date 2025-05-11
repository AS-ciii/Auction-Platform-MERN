import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const auctions = await db.collection("auctions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    return NextResponse.json(auctions)
  } catch (error) {
    console.error("Error fetching auctions:", error)
    return NextResponse.json({ error: "Failed to fetch auctions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const data = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'startingPrice', 'startTime', 'endTime']
    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 })
    }

    // Validate dates
    const startTime = new Date(data.startTime)
    const endTime = new Date(data.endTime)
    const now = new Date()

    if (isNaN(startTime.getTime())) {
      return NextResponse.json({ error: "Invalid start time format" }, { status: 400 })
    }

    if (isNaN(endTime.getTime())) {
      return NextResponse.json({ error: "Invalid end time format" }, { status: 400 })
    }

    if (startTime < now) {
      return NextResponse.json({ error: "Start time must be in the future" }, { status: 400 })
    }

    if (endTime <= startTime) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 })
    }

    // Validate price
    const startingPrice = parseFloat(data.startingPrice)
    if (isNaN(startingPrice) || startingPrice <= 0) {
      return NextResponse.json({ error: "Starting price must be greater than 0" }, { status: 400 })
    }

    // Get seller information
    const seller = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) })
    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 })
    }

    const auction = {
      ...data,
      seller: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "upcoming",
      currentPrice: startingPrice,
      bids: [],
      winner: null,
    }

    const result = await db.collection("auctions").insertOne(auction)
    if (!result.acknowledged) {
      throw new Error("Failed to insert auction into database")
    }
    
    // Return the created auction with seller information
    const createdAuction = {
      ...auction,
      _id: result.insertedId,
      seller: {
        _id: seller._id,
        name: seller.name
      }
    }
    
    return NextResponse.json(createdAuction)
  } catch (error) {
    console.error("Error creating auction:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create auction"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
} 
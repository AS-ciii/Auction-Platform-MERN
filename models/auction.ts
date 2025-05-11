import mongoose from "mongoose"

export interface IAuction extends mongoose.Document {
  title: string
  description: string
  startingPrice: number
  currentPrice: number
  imageUrl: string
  category: string
  startTime: Date
  endTime: Date
  seller: mongoose.Types.ObjectId
  winner?: mongoose.Types.ObjectId
  status: "upcoming" | "active" | "ended"
  bids: {
    bidder: mongoose.Types.ObjectId
    amount: number
    time: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const AuctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide auction title"],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide auction description"],
    },
    startingPrice: {
      type: Number,
      required: [true, "Please provide starting price"],
      min: 0,
    },
    currentPrice: {
      type: Number,
      default: function () {
        return this.startingPrice
      },
    },
    imageUrl: {
      type: String,
      default: "/placeholder.svg?height=300&width=300",
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    startTime: {
      type: Date,
      required: [true, "Please provide auction start time"],
    },
    endTime: {
      type: Date,
      required: [true, "Please provide auction end time"],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide seller information"],
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "ended"],
      default: "upcoming",
    },
    bids: [
      {
        bidder: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
)

// Update status based on time
AuctionSchema.pre("find", function () {
  this.where({
    startTime: { $lte: new Date() },
    endTime: { $gt: new Date() },
    status: { $ne: "active" },
  }).updateMany({}, { status: "active" })

  this.where({
    endTime: { $lte: new Date() },
    status: { $ne: "ended" },
  }).updateMany({}, { status: "ended" })
})

export default mongoose.models.Auction || mongoose.model<IAuction>("Auction", AuctionSchema)

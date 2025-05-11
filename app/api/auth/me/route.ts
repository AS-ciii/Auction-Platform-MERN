import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import connectDB from "@/lib/db"
import User from "@/models/user"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production")

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const verified = await jwtVerify(token, JWT_SECRET)
    const userId = verified.payload.userId as string

    await connectDB()
    const user = await User.findById(userId).select("-password")

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }
}

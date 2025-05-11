import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import AuctionCard from "@/components/AuctionCard"

async function getAuctions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auctions`, {
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch auctions')
  }
  return res.json()
}

export default async function AuctionsPage() {
  const session = await getServerSession(authOptions)
  const auctions = await getAuctions()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Active Auctions</h1>
        {session && (
          <Link href="/auctions/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Auction
            </Button>
          </Link>
        )}
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No auctions found</h2>
          <p className="text-muted-foreground mb-6">
            Be the first to create an auction!
          </p>
          {session ? (
            <Link href="/auctions/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Auction
              </Button>
            </Link>
          ) : (
            <Link href="/auth/signin">
              <Button>Sign in to create an auction</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction._id.toString()} auction={auction} />
          ))}
        </div>
      )}
    </div>
  )
}

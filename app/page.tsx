import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Gavel, Clock, Award, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-auction-light via-white to-purple-50">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=500')] bg-repeat opacity-5"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-auction-primary/10 px-3 py-1 text-sm text-auction-primary">
                  The Future of Online Auctions
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-auction-primary to-auction-secondary">
                  Discover, Bid, Win
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our exclusive auction platform where you can find unique items, place competitive bids, and win
                  treasures from around the world.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-auction-primary hover:bg-auction-dark" size="lg" asChild>
                    <Link href="/auctions">Explore Auctions</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/auth/register">Join Now</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:mr-0 relative">
                <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-auction-primary/20 to-auction-secondary/20 blur-xl"></div>
                <div className="relative bg-white p-4 rounded-xl shadow-xl">
                  <img
                    alt="Auction Platform"
                    className="mx-auto aspect-video overflow-hidden rounded-lg object-cover"
                    height="310"
                    src="/auction-hammer-3d-render_825385-405.avif"
                    width="550"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                Our platform makes it easy to participate in auctions from anywhere in the world.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-auction-primary/10">
                  <Gavel className="h-8 w-8 text-auction-primary" />
                </div>
                <h3 className="text-xl font-bold">Create or Browse</h3>
                <p className="text-gray-500">
                  Sign up as an auctioneer to list your items or as a buyer to browse and bid on auctions.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-auction-primary/10">
                  <Clock className="h-8 w-8 text-auction-primary" />
                </div>
                <h3 className="text-xl font-bold">Bid in Real-Time</h3>
                <p className="text-gray-500">
                  Place bids on active auctions and receive real-time updates on your bidding status.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-auction-primary/10">
                  <Award className="h-8 w-8 text-auction-primary" />
                </div>
                <h3 className="text-xl font-bold">Win & Collect</h3>
                <p className="text-gray-500">
                  If you're the highest bidder when the auction ends, you win the item and can arrange collection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-auction-primary text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Start Bidding?</h2>
                <p className="max-w-[600px] text-auction-light md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are already finding unique items and great deals on our platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-end">
                <Button className="bg-white text-auction-primary hover:bg-gray-100" size="lg" asChild>
                  <Link href="/auth/register">
                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg" asChild>
                  <Link href="/auctions">Browse Auctions</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2">
                <Gavel className="h-6 w-6 text-auction-primary" />
                <span className="font-bold text-xl">AuctionHub</span>
              </Link>
              <p className="mt-2 text-sm text-gray-500">
                The modern platform for online auctions, connecting buyers and sellers worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/auctions" className="text-gray-500 hover:text-auction-primary">
                    Auctions
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-gray-500 hover:text-auction-primary">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-500 hover:text-auction-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-500 hover:text-auction-primary">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-500 hover:text-auction-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-500 hover:text-auction-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-500 hover:text-auction-primary">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-500 hover:text-auction-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-auction-primary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-auction-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-500 hover:text-auction-primary">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="/licenses" className="text-gray-500 hover:text-auction-primary">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} AuctionHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

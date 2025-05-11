"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { BarChart3, DollarSign, Gavel, Package, Users } from "lucide-react"
import Link from "next/link"

interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "auctioneer" | "buyer"
  createdAt: string
}

interface Auction {
  _id: string
  title: string
  currentPrice: number
  status: "upcoming" | "active" | "ended"
  seller: {
    _id: string
    name: string
  }
  createdAt: string
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuctions: 0,
    activeAuctions: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== "admin") {
      router.push("/unauthorized")
      return
    }

    // In a real app, you would fetch this data from your API
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        },
        {
          _id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "auctioneer",
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
        },
        {
          _id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "buyer",
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        },
        {
          _id: "4",
          name: "Alice Williams",
          email: "alice@example.com",
          role: "buyer",
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        },
        {
          _id: "5",
          name: "Charlie Brown",
          email: "charlie@example.com",
          role: "auctioneer",
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        },
      ]

      const mockAuctions: Auction[] = [
        {
          _id: "1",
          title: "Vintage Camera",
          currentPrice: 120,
          status: "active",
          seller: {
            _id: "2",
            name: "Jane Smith",
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        },
        {
          _id: "2",
          title: "Antique Watch",
          currentPrice: 350,
          status: "active",
          seller: {
            _id: "2",
            name: "Jane Smith",
          },
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        },
        {
          _id: "3",
          title: "Rare Coin Collection",
          currentPrice: 500,
          status: "active",
          seller: {
            _id: "5",
            name: "Charlie Brown",
          },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        },
        {
          _id: "4",
          title: "Art Deco Lamp",
          currentPrice: 275,
          status: "ended",
          seller: {
            _id: "5",
            name: "Charlie Brown",
          },
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        },
        {
          _id: "5",
          title: "Signed Baseball",
          currentPrice: 150,
          status: "upcoming",
          seller: {
            _id: "2",
            name: "Jane Smith",
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        },
      ]

      const mockStats = {
        totalUsers: mockUsers.length,
        totalAuctions: mockAuctions.length,
        activeAuctions: mockAuctions.filter((a) => a.status === "active").length,
        totalRevenue: mockAuctions.reduce(
          (sum, auction) => sum + (auction.status === "ended" ? auction.currentPrice * 0.1 : 0),
          0,
        ),
      }

      setUsers(mockUsers)
      setAuctions(mockAuctions)
      setStats(mockStats)
      setLoading(false)
    }, 1500)
  }, [user, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>
      case "auctioneer":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Auctioneer</Badge>
      case "buyer":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Buyer</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Upcoming
          </Badge>
        )
      case "ended":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Ended
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (user && user.role !== "admin") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users, auctions, and platform settings</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : stats.totalUsers}
                </div>
                <p className="text-xs text-muted-foreground">Registered users on the platform</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
                <Gavel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : stats.totalAuctions}
                </div>
                <p className="text-xs text-muted-foreground">All auctions on the platform</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : stats.activeAuctions}
                </div>
                <p className="text-xs text-muted-foreground">Currently active auctions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : `$${stats.totalRevenue.toFixed(2)}`}
                </div>
                <p className="text-xs text-muted-foreground">10% commission on completed auctions</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="auctions">Auctions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage all users on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Name</th>
                            <th className="text-left py-3 px-2">Email</th>
                            <th className="text-left py-3 px-2">Role</th>
                            <th className="text-left py-3 px-2">Joined</th>
                            <th className="text-left py-3 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id} className="border-b">
                              <td className="py-3 px-2">{user.name}</td>
                              <td className="py-3 px-2">{user.email}</td>
                              <td className="py-3 px-2">{getRoleBadge(user.role)}</td>
                              <td className="py-3 px-2">{formatDate(user.createdAt)}</td>
                              <td className="py-3 px-2">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Export Users</Button>
                  <Button className="bg-auction-primary hover:bg-auction-dark">Add User</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="auctions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Auction Management</CardTitle>
                  <CardDescription>View and manage all auctions on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Title</th>
                            <th className="text-left py-3 px-2">Price</th>
                            <th className="text-left py-3 px-2">Status</th>
                            <th className="text-left py-3 px-2">Seller</th>
                            <th className="text-left py-3 px-2">Created</th>
                            <th className="text-left py-3 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {auctions.map((auction) => (
                            <tr key={auction._id} className="border-b">
                              <td className="py-3 px-2">{auction.title}</td>
                              <td className="py-3 px-2">${auction.currentPrice.toFixed(2)}</td>
                              <td className="py-3 px-2">{getStatusBadge(auction.status)}</td>
                              <td className="py-3 px-2">{auction.seller.name}</td>
                              <td className="py-3 px-2">{formatDate(auction.createdAt)}</td>
                              <td className="py-3 px-2">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/auctions/${auction._id}`}>View</Link>
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    Edit
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Export Auctions</Button>
                  <Button className="bg-auction-primary hover:bg-auction-dark" asChild>
                    <Link href="/auctions/create">Create Auction</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>View platform performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  {loading ? (
                    <Skeleton className="h-full w-full rounded" />
                  ) : (
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        In a production environment, this would display charts and graphs showing platform metrics, user
                        growth, auction activity, and revenue.
                      </p>
                      <Button>Generate Report</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure global platform settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Commission Rate</h3>
                      <p className="text-sm text-muted-foreground">
                        Set the percentage commission taken from successful auctions.
                      </p>
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue="10" min="0" max="100" className="w-24" />
                        <span>%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Minimum Bid Increment</h3>
                      <p className="text-sm text-muted-foreground">
                        Set the minimum amount a new bid must exceed the current bid.
                      </p>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input type="number" defaultValue="10" min="1" className="w-24" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Default Auction Duration</h3>
                      <p className="text-sm text-muted-foreground">Set the default duration for new auctions.</p>
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue="7" min="1" className="w-24" />
                        <span>days</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-auction-primary hover:bg-auction-dark">Save Settings</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Mode</CardTitle>
                  <CardDescription>Take the platform offline for maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Switch id="maintenance-mode" />
                    <div>
                      <Label htmlFor="maintenance-mode" className="text-base">
                        Enable Maintenance Mode
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        When enabled, the platform will be inaccessible to regular users. Only administrators will be
                        able to log in.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

// Helper components for the settings tab
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string }) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  )
}

function Switch({ id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return (
    <div className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:bg-auction-primary">
      <input type="checkbox" id={id} className="peer absolute h-full w-full cursor-pointer opacity-0" {...props} />
      <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 peer-checked:translate-x-5" />
    </div>
  )
}

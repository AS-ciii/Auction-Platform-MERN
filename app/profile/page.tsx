"use client"

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Settings, History, CreditCard, Award, Gavel } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

interface UserStats {
  activeBids: number
  wonAuctions: number
  activeAuctions: number
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    activeBids: 0,
    wonAuctions: 0,
    activeAuctions: 0
  })

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch('/api/user/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error)
      }
    }

    if (user) {
      fetchUserStats()
    }
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="grid gap-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 rounded-full bg-auction-primary/10 flex items-center justify-center">
              <User className="w-12 h-12 text-auction-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bids">My Bids</TabsTrigger>
              <TabsTrigger value="auctions">My Auctions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
                    <History className="h-4 w-4 text-auction-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeBids}</div>
                    <p className="text-xs text-gray-500">Current active bids</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Won Auctions</CardTitle>
                    <Award className="h-4 w-4 text-auction-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.wonAuctions}</div>
                    <p className="text-xs text-gray-500">Total auctions won</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
                    <Gavel className="h-4 w-4 text-auction-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeAuctions}</div>
                    <p className="text-xs text-gray-500">Current active auctions</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bids">
              <Card>
                <CardHeader>
                  <CardTitle>My Bids</CardTitle>
                  <CardDescription>View and manage your active bids</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No active bids at the moment.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="auctions">
              <Card>
                <CardHeader>
                  <CardTitle>My Auctions</CardTitle>
                  <CardDescription>Manage your created auctions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No active auctions at the moment.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <p className="text-sm text-gray-500">Configure your notification preferences</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Payment Methods</h3>
                    <p className="text-sm text-gray-500">Manage your payment methods</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Privacy</h3>
                    <p className="text-sm text-gray-500">Control your privacy settings</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
} 
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, setHours, setMinutes } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import Link from "next/link"

export default function CreateAuctionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Set default dates with proper time
  const defaultStartDate = setMinutes(setHours(addDays(new Date(), 1), 0), 0) // Tomorrow at midnight
  const defaultEndDate = setMinutes(setHours(addDays(new Date(), 8), 0), 0) // 8 days from now at midnight

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startingPrice: "",
    imageUrl: "/placeholder.svg?height=300&width=300",
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      // Ensure the date is set to midnight UTC
      const newDate = setMinutes(setHours(date, 0), 0)
      setFormData((prev) => ({ ...prev, [name]: newDate }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        toast.error("Please sign in to create an auction")
        router.push("/auth/login")
        return
      }

      // Validate form data before submission
      if (!formData.title || !formData.description || !formData.category || !formData.startingPrice) {
        toast.error("Please fill in all required fields")
        return
      }

      // Validate dates
      const now = new Date()
      if (formData.startDate <= now) {
        toast.error("Start date must be in the future")
        return
      }

      if (formData.endDate <= formData.startDate) {
        toast.error("End date must be after start date")
        return
      }

      const response = await fetch("/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sellerId: user.id,
          status: "active",
          currentPrice: parseFloat(formData.startingPrice),
          startTime: formData.startDate.toISOString(),
          endTime: formData.endDate.toISOString(),
        }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create auction")
      }

      toast.success("Auction created successfully!")
      router.push("/auctions")
    } catch (error) {
      console.error("Error creating auction:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create auction")
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    "Art & Collectibles",
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Jewelry & Watches",
    "Sports & Outdoors",
    "Toys & Hobbies",
    "Vehicles",
    "Other",
  ]

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Please sign in to create an auction</h1>
              <Button className="mt-4" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create Auction</h1>
            <p className="text-muted-foreground">List a new item for auction</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                  <CardDescription>Provide information about the item you're auctioning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter a descriptive title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your item in detail"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="min-h-32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>Set your starting price</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startingPrice">Starting Price ($)</Label>
                    <Input
                      id="startingPrice"
                      name="startingPrice"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.startingPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Auction Duration</CardTitle>
                  <CardDescription>Set when your auction starts and ends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => handleDateChange("startDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => handleDateChange("endDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Item Image</CardTitle>
                  <CardDescription>Upload an image of your item</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="border rounded-md overflow-hidden w-full max-w-md">
                      <img
                        src={formData.imageUrl || "/placeholder.svg"}
                        alt="Item preview"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <div className="w-full max-w-md">
                      <Label htmlFor="imageUrl" className="mb-2 block">
                        Image URL
                      </Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        placeholder="Enter image URL"
                        value={formData.imageUrl}
                        onChange={handleChange}
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Enter a URL for your item image or use the default placeholder
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button className="bg-auction-primary hover:bg-auction-dark" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Auction"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

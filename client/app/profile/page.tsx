"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { userAPI } from "@/lib/api"
import { formatBytes, formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: string
}

interface UserStats {
  totalSent: number
  totalReceived: number
  totalStorage: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [updating, setUpdating] = useState(false)
  const { user, checkAuth } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchProfileAndStats = async () => {
      try {
        setLoading(true)
        const [profileData, statsData] = await Promise.all([userAPI.getProfile(), userAPI.getStats()])

        setProfile(profileData)
        setStats(statsData)
        setName(profileData.name)
      } catch (error) {
        toast({
          title: "Error fetching profile",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndStats()
  }, [user, router, toast])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match",
        variant: "destructive",
      })
      return
    }

    try {
      setUpdating(true)

      const updateData: { name?: string; currentPassword?: string; newPassword?: string } = {}

      if (name !== profile?.name) {
        updateData.name = name
      }

      if (currentPassword && newPassword) {
        updateData.currentPassword = currentPassword
        updateData.newPassword = newPassword
      }

      if (Object.keys(updateData).length === 0) {
        toast({
          title: "No changes to update",
          description: "Please make some changes before updating",
        })
        return
      }

      await userAPI.updateProfile(updateData)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      // Reset password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Refresh auth context
      await checkAuth()
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View and update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" value={profile?.email || ""} disabled />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="currentPassword" className="text-sm font-medium">
                          Current Password
                        </label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium">
                          New Password
                        </label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-start-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm New Password
                        </label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={updating}>
                  {updating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>Overview of your file sharing activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Files Sent</h4>
                  <p className="text-2xl font-bold">{stats?.totalSent || 0}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Files Received</h4>
                  <p className="text-2xl font-bold">{stats?.totalReceived || 0}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage Used</h4>
                  <p className="text-2xl font-bold">{stats ? formatBytes(stats.totalStorage) : "0 B"}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Account Details</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Member since: {profile ? formatDate(profile.createdAt) : "Unknown"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

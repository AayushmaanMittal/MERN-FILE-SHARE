"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut, User, Menu, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Close mobile menu when navigating or resizing to desktop
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [router, isMobile])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-6 w-6" />
          <span>Secure File Sharing</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
                Profile
              </Link>
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm">Hello, {user.name}</span>
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                About
              </Link>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="ml-2">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <nav className="flex flex-col space-y-4">
            {user ? (
              <>
                <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
                  Profile
                </Link>
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Dashboard
                </Link>
                <div className="pt-2 border-t">
                  <span className="text-sm block mb-2">Hello, {user.name}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                  About
                </Link>
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild className="w-full">
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

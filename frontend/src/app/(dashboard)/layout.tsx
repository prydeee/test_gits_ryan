"use client"

import { useAuth } from "@/lib/auth-store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2, BookOpen, Users, Building2, Home, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) return null

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Buku", href: "/books", icon: BookOpen },
    { name: "Penulis", href: "/authors", icon: Users },
    { name: "Penerbit", href: "/publishers", icon: Building2 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER + NAVIGATION */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Katalog Buku Admin</h1>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                      isActive && "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                )
              })}
            </nav>

            {/* User + Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Hai, <span className="font-medium">{user.name}</span>!
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout()
                  router.push("/login")
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:hidden border-t bg-white">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  className={cn("flex flex-col items-center gap-1", isActive && "text-blue-600")}
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
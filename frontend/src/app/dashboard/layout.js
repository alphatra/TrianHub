'use client'

import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Dumbbell, Calendar, Loader2, List, Menu, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!session) return null

  const isActive = (path) => pathname === path

  const NavContent = () => (
    <nav className="space-y-2">
      {[
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/dashboard/training", icon: Dumbbell, label: "Exercises" },
        { href: "/dashboard/workouts", icon: List, label: "Workouts" },
        { href: "/dashboard/calendar", icon: Calendar, label: "Schedule" },
      ].map((item) => (
        <Link key={item.href} href={item.href}>
          <Button 
            variant={isActive(item.href) ? "secondary" : "ghost"} 
            className="w-full justify-start text-gray-700"
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-white">
            <div className="py-4">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar>
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                  <AvatarFallback>{session.user.name?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-800">{session.user.name}</h2>
                  <p className="text-sm text-gray-500">{session.user.email}</p>
                </div>
              </div>
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Card className="w-64 p-4 m-2 space-y-4 bg-white border-none shadow-lg">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
              <AvatarFallback>{session.user.name?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-800">{session.user.name}</h2>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>
          <NavContent />
          <Button variant="ghost" className="w-full justify-start mt-auto text-gray-700" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </Card>
      )}
      <motion.div 
        className="flex-1 p-6 overflow-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

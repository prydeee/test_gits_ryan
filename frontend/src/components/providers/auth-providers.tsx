"use client"
import { useAuth } from "@/lib/auth-store"
import { useEffect } from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuth()
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  return <>{children}</>
}
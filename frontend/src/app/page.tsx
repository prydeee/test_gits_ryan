"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-store'

export default function HomePage() {
  const router = useRouter()
  const { token, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.replace('/dashboard')
      } else {
        router.replace('/login')
      }
    }
  }, [token, isLoading, router])

  // Jangan render apa-apa
  return null
}
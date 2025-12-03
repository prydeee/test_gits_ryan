"use client"

import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { BookOpen, Users, Building2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()

  const menuItems = [
    {
      title: "Penulis",
      description: "Kelola data penulis buku",
      icon: Users,
      path: "/authors",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Buku",
      description: "Kelola katalog buku",
      icon: BookOpen,
      path: "/books",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Penerbit",
      description: "Kelola data penerbit",
      icon: Building2,
      path: "/publishers",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Selamat Datang di Katalog Buku! 📚</h2>
        <p className="mt-2 text-gray-600">Pilih menu di bawah untuk mengelola data perpustakaan Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.path}
              onClick={() => router.push(item.path)}
              className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 hover:border-gray-300"
            >
              <div className={`w-14 h-14 rounded-lg ${item.bgColor} flex items-center justify-center mb-4`}>
                <Icon className={`w-7 h-7 ${item.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.description}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                Kelola sekarang
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
import { create } from "zustand"
import axios from "axios"

type User = {
  id: number
  name: string
  email: string
}

type AuthStore = {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  
  login: async (email: string, password: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        email,
        password,
      })
      
      const { user, token } = res.data
      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      
      set({ user, token, isLoading: false })
    } catch (error: any) {
      throw error.response?.data?.message || "Login gagal"
    }
  },
  
  logout: () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    set({ user: null, token: null })
  },
  
  checkAuth: async () => {
    if (typeof window === "undefined") {
      set({ isLoading: false })
      return
    }
    
    const token = localStorage.getItem("token")
    
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`)
        set({ user: res.data, token, isLoading: false })
      } catch (error) {
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
        set({ user: null, token: null, isLoading: false })
      }
    } else {
      set({ user: null, token: null, isLoading: false })
    }
  },
}))
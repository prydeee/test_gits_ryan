import { create } from 'zustand'

type Toast = {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'destructive'
}

type ToastStore = {
  toasts: Toast[]
  addToast: (title: string, description?: string, variant?: Toast['variant']) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (title, description, variant = 'default') => set((state) => ({
    toasts: [...state.toasts, {
      id: Math.random().toString(36),
      title,
      description,
      variant
    }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}))
"use client"

import { Toast } from "./toast"
import { useToastStore } from "@/lib/toast"

export function Toaster() {
  const { toasts, removeToast } = useToastStore()

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
}
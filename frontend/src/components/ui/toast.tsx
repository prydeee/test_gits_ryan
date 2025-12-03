"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onClose: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5",
      "w-80 rounded-lg border bg-card p-4 shadow-lg transition-all"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "mt-1 h-2 w-2 rounded-full",
          variant === "success" && "bg-green-500",
          variant === "destructive" && "bg-red-500",
          variant === "default" && "bg-blue-500"
        )} />
        <div className="flex-1">
          {title && <p className="font-semibold text-foreground">{title}</p>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="rounded-sm p-1 hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
'use client'

import { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title?: string
  children: ReactNode
}

export function Modal({ open, title, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-sol-card border border-sol-border rounded-xl p-5 shadow-2xl animate-fade-in max-h-[85vh] overflow-y-auto">
        {title && (
          <h2 className="font-pixel text-xs text-sol-green glow-green mb-4 leading-relaxed">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}

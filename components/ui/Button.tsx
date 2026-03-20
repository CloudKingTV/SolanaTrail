'use client'

import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-sol-green/20 border-sol-green/50 text-sol-green hover:bg-sol-green/30 active:bg-sol-green/40',
  secondary:
    'bg-sol-purple/20 border-sol-purple/50 text-sol-purple hover:bg-sol-purple/30 active:bg-sol-purple/40',
  danger:
    'bg-danger/20 border-danger/50 text-danger hover:bg-danger/30 active:bg-danger/40',
  ghost:
    'bg-transparent border-sol-border text-sol-muted hover:bg-sol-card hover:text-sol-text',
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        min-h-[48px] px-6 py-3 rounded-lg border font-semibold text-sm
        transition-all duration-150 btn-press
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

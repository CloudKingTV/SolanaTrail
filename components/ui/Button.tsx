'use client'

import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-sol-green/15 border-sol-green/40 text-sol-green hover:bg-sol-green/25 active:bg-sol-green/35',
  secondary:
    'bg-sol-purple/15 border-sol-purple/40 text-sol-purple hover:bg-sol-purple/25 active:bg-sol-purple/35',
  danger:
    'bg-danger/15 border-danger/40 text-danger hover:bg-danger/25 active:bg-danger/35',
  ghost:
    'bg-transparent border-sol-border text-sol-muted hover:bg-sol-card hover:text-sol-text hover:border-sol-border',
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
        min-h-[44px] px-5 py-2.5 rounded-lg border font-semibold text-sm
        transition-all duration-150 btn-press
        disabled:opacity-25 disabled:cursor-not-allowed disabled:pointer-events-none
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

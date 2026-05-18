import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type TekinButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'

export type TekinButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: TekinButtonVariant
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-50'

const variants: Record<TekinButtonVariant, string> = {
  primary:
    'bg-[color:var(--tekin-emerald)] text-white hover:bg-[color:var(--tekin-emerald-mid)]',
  secondary:
    'border border-[color:var(--tekin-gray-200)] bg-[color:var(--tekin-white)] text-[color:var(--tekin-gray-800)] hover:bg-[color:var(--tekin-gray-50)]',
  ghost:
    'bg-transparent text-[color:var(--tekin-gray-800)] hover:bg-[color:var(--tekin-gray-100)]',
  danger:
    'bg-[color:var(--tekin-red)] text-white hover:opacity-90',
}

export function TekinButton({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...rest
}: TekinButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

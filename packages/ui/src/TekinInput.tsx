import type { InputHTMLAttributes, ReactNode } from 'react'

export type TekinInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: ReactNode
}

export function TekinInput({
  label,
  error,
  hint,
  id,
  className = '',
  ...rest
}: TekinInputProps) {
  const inputId = id ?? rest.name ?? label.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={inputId}
        className="text-[12px] font-medium uppercase tracking-wide text-[color:var(--tekin-gray-600)]"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-lg border bg-[color:var(--tekin-white)] px-3 py-2.5 text-sm text-[color:var(--tekin-gray-800)] placeholder:text-[color:var(--tekin-gray-400)] outline-none transition-[border-color] duration-150 ${
          error
            ? 'border-[color:var(--tekin-red)]'
            : 'border-[color:var(--tekin-gray-200)] focus:border-[color:var(--tekin-emerald)]'
        }`}
        {...rest}
      />
      {error ? (
        <p className="text-[12px] font-medium text-[color:var(--tekin-red)]">
          {error}
        </p>
      ) : null}
      {!error && hint ? (
        <p className="text-[12px] text-[color:var(--tekin-gray-600)]">{hint}</p>
      ) : null}
    </div>
  )
}

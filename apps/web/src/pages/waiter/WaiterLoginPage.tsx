/**
 * Screen: Waiter login — Floor staff — PIN gate before service.
 */
import { TekinButton, TekinCard, TekinInput } from '@tekin/ui'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { RESTAURANT, STAFF } from '../../data/fixtures'
import { useAppStore } from '../../stores/useAppStore'

export function WaiterLoginPage() {
  const navigate = useNavigate()
  const waiterLogin = useAppStore((s) => s.waiterLogin)
  const existingSession = useAppStore((s) => s.waiterSession)

  const [name, setName] = useState<string>(STAFF.waiters[0] ?? '')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  if (existingSession != null) {
    return <Navigate to="/waiter/new" replace />
  }

  const submit = () => {
    setError(undefined)
    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits')
      return
    }
    const ok = waiterLogin(name, pin)
    if (!ok) {
      setError('Wrong PIN for this name — try again.')
      return
    }
    navigate('/waiter/new', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-tekin-gray-50 px-4 py-10">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-tekin-gray-600">
          TEKIN Floor
        </p>
        <h1 className="mt-2 text-[26px] font-semibold text-tekin-gray-900">
          Sign in to serve
        </h1>
        <p className="mt-2 max-w-sm text-sm text-tekin-gray-600">
          {RESTAURANT.name} · pick your name and enter your shift PIN.
        </p>
      </div>

      <TekinCard className="w-full max-w-md border-tekin-navy bg-tekin-white">
        <label
          htmlFor="waiter-name"
          className="text-[12px] font-medium uppercase tracking-wide text-tekin-gray-600"
        >
          Your name
        </label>
        <select
          id="waiter-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-lg border border-tekin-gray-200 bg-tekin-white px-3 py-3 text-[15px] font-semibold text-tekin-gray-900 outline-none focus:border-tekin-emerald"
        >
          {STAFF.waiters.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        <div className="mt-5">
          <TekinInput
            label="4-digit PIN"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            placeholder="••••"
            value={pin}
            error={error}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 4)
              setPin(v)
              setError(undefined)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
          />
        </div>

        <p className="mt-4 text-[12px] text-tekin-gray-600">
          Demo PIN for every waiter:{' '}
          <span className="font-semibold text-tekin-gray-800">4242</span>
        </p>

        <TekinButton
          type="button"
          className="mt-6 min-h-[54px] w-full text-[15px]"
          onClick={submit}
        >
          Enter floor
        </TekinButton>
      </TekinCard>
    </div>
  )
}

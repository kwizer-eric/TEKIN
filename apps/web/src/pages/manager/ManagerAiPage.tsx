/**
 * Screen: Manager AI assistant — prompt chips & mock narrative replies.
 */
import { TekinBadge, TekinButton, TekinCard } from '@tekin/ui'
import { Brain, Sparkles } from 'lucide-react'
import { useState } from 'react'
import {
  MANAGER_AI_PROMPTS,
  MANAGER_AI_REPLY,
} from './managerMocks'

export function ManagerAiPage() {
  const [activeId, setActiveId] = useState<string>(MANAGER_AI_PROMPTS[0]?.id ?? '')

  const reply = activeId ? MANAGER_AI_REPLY[activeId] : undefined
  const activePrompt = MANAGER_AI_PROMPTS.find((p) => p.id === activeId)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
      <TekinCard className="flex h-full min-h-0 flex-col lg:max-w-xs lg:shrink-0">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-tekin-blue" aria-hidden />
          <h2 className="text-[16px] font-semibold text-tekin-gray-900">
            Prompts
          </h2>
        </div>
        <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto pr-1">
          {MANAGER_AI_PROMPTS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setActiveId(p.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-[13px] font-semibold transition-colors duration-150 ${
                  activeId === p.id
                    ? 'border-tekin-emerald bg-tekin-emerald-light text-tekin-emerald'
                    : 'border-tekin-gray-200 bg-tekin-white text-tekin-gray-800 hover:bg-tekin-gray-50'
                }`}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] leading-relaxed text-tekin-gray-600">
          Demo answers only — wire your model + venue guardrails for production.
        </p>
      </TekinCard>

      <TekinCard className="flex min-h-0 flex-1 flex-col overflow-auto border-tekin-navy/15">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-tekin-amber" aria-hidden />
            <h2 className="text-[16px] font-semibold text-tekin-gray-900">
              TEKIN partner reply
            </h2>
          </div>
          <TekinBadge status="info" label="Mock" />
        </div>

        {activePrompt ? (
          <div className="rounded-xl bg-tekin-gray-50 px-4 py-3 text-[13px] text-tekin-gray-700">
            <span className="font-semibold text-tekin-gray-900">You asked · </span>
            {activePrompt.prompt}
          </div>
        ) : null}

        {reply ? (
          <div className="mt-6">
            <p className="text-[15px] font-semibold text-tekin-gray-900">{reply.title}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {reply.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-xl border border-tekin-gray-100 bg-tekin-white px-4 py-3 text-[14px] leading-relaxed text-tekin-gray-800"
                >
                  <span className="font-semibold text-tekin-emerald">{i + 1}.</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-8 text-sm text-tekin-gray-600">Pick a prompt to preview copy.</p>
        )}

        <div className="mt-8 flex flex-wrap gap-3 border-t border-tekin-gray-100 pt-6">
          <TekinButton type="button">Insert into shift notes</TekinButton>
          <TekinButton type="button" variant="secondary">
            Regenerate (demo)
          </TekinButton>
        </div>
      </TekinCard>
    </div>
  )
}

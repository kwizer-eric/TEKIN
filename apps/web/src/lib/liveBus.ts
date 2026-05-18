export type LiveEventMap = {
  'metrics:tick': { revenueBump: number; ordersBump: number }
  'order:live': { table: string; total: number }
}

type Listener<K extends keyof LiveEventMap> = (payload: LiveEventMap[K]) => void

const listeners = new Map<keyof LiveEventMap, Set<Listener<keyof LiveEventMap>>>()

export function liveOn<K extends keyof LiveEventMap>(
  event: K,
  fn: Listener<K>,
): () => void {
  let set = listeners.get(event)
  if (!set) {
    set = new Set()
    listeners.set(event, set)
  }
  set.add(fn as Listener<keyof LiveEventMap>)
  return () => set!.delete(fn as Listener<keyof LiveEventMap>)
}

export function liveEmit<K extends keyof LiveEventMap>(
  event: K,
  payload: LiveEventMap[K],
): void {
  const set = listeners.get(event)
  if (!set) return
  set.forEach((fn) => {
    ;(fn as Listener<K>)(payload)
  })
}

let simulationId: ReturnType<typeof setInterval> | undefined

export function startLiveSimulation(): () => void {
  if (simulationId) window.clearInterval(simulationId)
  simulationId = window.setInterval(() => {
    liveEmit('metrics:tick', {
      revenueBump: Math.round(Math.random() * 8000),
      ordersBump: Math.random() > 0.88 ? 1 : 0,
    })
    if (Math.random() > 0.94) {
      liveEmit('order:live', { table: `${Math.floor(Math.random() * 16) + 1}`, total: 0 })
    }
  }, 3200)
  return () => {
    if (simulationId) window.clearInterval(simulationId)
    simulationId = undefined
  }
}

import { useEffect } from 'react'
import { liveOn, startLiveSimulation } from '../lib/liveBus'
import { useAppStore } from '../stores/useAppStore'

export function LiveBootstrap() {
  useEffect(() => {
    const stopSim = startLiveSimulation()
    const unsub = liveOn('metrics:tick', (p) => {
      useAppStore.getState().bumpMetrics({
        revenue: p.revenueBump,
        orders: p.ordersBump,
      })
    })
    return () => {
      unsub()
      stopSim()
    }
  }, [])

  return null
}

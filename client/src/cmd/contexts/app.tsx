import { createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { Notifiable, OnChange } from '../../platform/preact/reactive.ts'

export const AppContext = createContext<Map<any, any>>(new Map())

export function useAppContext(): Map<any, unknown> {
  return useContext(AppContext)
}

export function useInject<C extends new (...args: any[]) => any>(key: C): InstanceType<C>
export function useInject<T extends unknown>(key: any): T
export function useInject<T extends unknown>(key: any): T {
  const target = useContext(AppContext).get(key)
  if (!target) {
    throw new Error(`Nothing provided for key ${key}`)
  }

  // This is probably a wasteful approach to reactivity
  if (!(OnChange in target)) {
    return target
  }

  const [targetNotifiable, setTargetNotifiable] = useState<[T & Notifiable]>([target])

  useEffect(() => {
    const fn = () => setTargetNotifiable([target])
    targetNotifiable[0][OnChange].addEventListener('change', fn)
    return () => targetNotifiable[0][OnChange].removeEventListener('change', fn)
  }, [target]);
  
  return targetNotifiable[0] as T
}

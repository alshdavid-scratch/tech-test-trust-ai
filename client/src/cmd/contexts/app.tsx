import { createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export const AppContext = createContext<Map<any, any>>(new Map())

export function useAppContext(): Map<any, unknown> {
  return useContext(AppContext)
}

export function useInject<C extends new (...args: any[]) => any>(key: C): InstanceType<C>
export function useInject<T extends unknown>(key: any): T
export function useInject<T extends unknown>(key: any): T {
  const i = useContext(AppContext).get(key)
  if (!i) {
    throw new Error(`Nothing provided for key ${key}`)
  }

  // This is probably a wasteful approach to reactivity
  if (!(i instanceof EventTarget)) {
    return i
  }

  const [ri, setRi] = useState<[EventTarget]>([i])

  useEffect(() => {
    const fn = () => setRi([i])
    i.addEventListener('change', fn)
    return () => i.removeEventListener('change', fn)
  }, [i]);
  
  return ri[0] as T
}

import { useEffect, useState } from "preact/hooks"

export const OnChange = Symbol('Reactive')

export class ChangeNotifier extends EventTarget {
  notify() {
    this.dispatchEvent(new Event('change'))
  }

  onChange(callback: () => any, once: boolean = false): () => void {
    this.addEventListener('change', callback, { once })
    return () => this.removeEventListener('change', callback)
  }
}

export interface Notifiable {
  [OnChange]: ChangeNotifier
}



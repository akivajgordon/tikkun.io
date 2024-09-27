type Listener<T> = (payload: T) => void

export class EventEmitter<T> {
  private listeners: { [Name in keyof T]?: Listener<T[Name]>[] } = {}

  emit<Name extends keyof T>(name: Name, payload?: T[Name]): void {
    const listeners = this.listeners[name] || []
    listeners.forEach((listener) => {
      listener(payload)
    })
  }

  on<Name extends keyof T>(name: Name, callback: Listener<T[Name]>): void {
    const listeners = this.listeners[name] || []

    listeners.push(callback)

    this.listeners[name] = listeners
  }
}

export default {
  new: <T>(): EventEmitter<T> => {
    return new EventEmitter<T>()
  },
}

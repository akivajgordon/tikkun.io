// type Listener<T> = {
//   evt: string
//   callback: (payload: T) => void
// }

// export type EventEmitter<T extends { event: string, payload: U}> = {
//   emit: (evt: Listener<T>['evt'], payload?: T) => void
//   on: (evt: Listener<T>['evt'], callback: Listener<T>['callback']) => void
// }

// export type EventEmitter<T extends Record<string, any>> = {
//     emit: <Name extends keyof T>(name: Name, payload?: T[Name]) => void,
//     on: <Name extends keyof T>(name: Name, callback: (payload: T[Name]) => void) => void
// }

type Listener<T> = (payload: T) => void

export class EventEmitter<T extends Record<string, any>> {
  #listeners: { [Name in keyof T]?: Listener<T[Name]>[] } = {}

  emit<Name extends keyof T>(name: Name, payload?: T[Name]): void {
    const listeners = this.#listeners[name]

    listeners.forEach((listener) => {
      listener(payload)
    })
  }

  on<Name extends keyof T>(name: Name, callback: Listener<T[Name]>): void {
    const listeners = this.#listeners[name] || []

    listeners.push(callback)
  }
}

export default {
  new: <T>(): EventEmitter<T> => {
    return new EventEmitter<T>()
  },
}

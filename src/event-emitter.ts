type Listener = {
  evt: string
  callback: (payload: unknown) => void
}

export default {
  new: () => {
    const listeners: Listener[] = []

    return {
      emit: (evt: string, payload: unknown) => {
        listeners
          .filter((listener) => listener.evt === evt)
          .forEach((listener) => {
            listener.callback(payload)
          })
      },
      on: (evt: Listener['evt'], callback: Listener['callback']) => {
        listeners.push({ evt, callback })
      },
    }
  },
}

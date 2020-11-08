export default {
  new: () => {
    const listeners = []

    return {
      emit: (evt, payload) => {
        listeners
          .filter(listener => listener.evt === evt)
          .forEach(listener => {
            listener.callback(payload)
          })
      },
      on: (evt, callback) => {
        listeners.push({ evt, callback })
      }
    }
  }
}

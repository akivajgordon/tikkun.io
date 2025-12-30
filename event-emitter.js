export class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    emit(name, payload) {
        const listeners = this.listeners[name] || [];
        listeners.forEach((listener) => {
            listener(payload);
        });
    }
    on(name, callback) {
        const listeners = this.listeners[name] || [];
        listeners.push(callback);
        this.listeners[name] = listeners;
    }
}
export default {
    new: () => {
        return new EventEmitter();
    },
};
//# sourceMappingURL=event-emitter.js.map
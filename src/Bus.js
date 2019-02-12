export class Bus {
  constructor () {
    // Subscribed components - array of closures
    this.subscribers = new Map
  }

  on (event, closure, component) {
    if (Array.isArray(event)) {
      event.forEach(event => this.on(event, closure, component))
      return
    }

    const componentSubscribes = this.subscribers.get(component) || this.subscribeNew(component)
    componentSubscribes[event] = closure
  }

  emit (event, ...args) {
    this.subscribers.forEach((subscribes, component) => {
      subscribes[event] && subscribes[event].call(component, ...args)
    })
  }

  wipeComponentSubscriptions (component) {
    this.subscribers.delete(component)
  }

  subscribeNew (component) {
    const componentSubscribes = {}
    this.subscribers.set(component, componentSubscribes)
    return componentSubscribes
  }
}

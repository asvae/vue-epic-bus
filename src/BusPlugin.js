const defaultOptions = {
  optionGroupName: 'subs',
  broadcastName: '$cast',
}

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

export const BusPlugin = {
  install (Vue, options = {}) {
    options = Object.assign({}, defaultOptions, options)

    const bus = new Bus()

    Vue.config.optionMergeStrategies.subs = Vue.config.optionMergeStrategies.methods

    Vue.mixin({
      created () {
        const subs = this.$options[options.optionGroupName]
        if (subs) {
          // For in didn't work for me here for some reason.
          Object.keys(subs).forEach(key => {
            bus.on(key, subs[key], this)
          })
        }
      },
      beforeDestroy () {
        bus.wipeComponentSubscriptions(this)
      },
    })

    Vue.prototype[options.broadcastName] = (event, ...args) => {
      bus.emit(event, ...args)
    }

    // For debug purposes.
    Vue.prototype.$busInstance = bus
  },
}

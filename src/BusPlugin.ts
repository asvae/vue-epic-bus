import Vue from 'vue'

type EpicBusPluginOptions = { optionGroupName?: string, broadcastName?: string }
type Closure = (...args: any[]) => void
type ComponentSubscription = { [key: string]: Closure }

const defaultOptions: EpicBusPluginOptions = {
  optionGroupName: 'subs',
  broadcastName: '$cast',
}


export class Bus {
  componentSubscriptionList: Map<Vue, ComponentSubscription> = new Map

  on (event: string | string[], closure: Closure, component: Vue) {
    if (Array.isArray(event)) {
      event.forEach(event => this.on(event, closure, component))
      return
    }

    const componentSubscribes = this.componentSubscriptionList.get(component) || this.subscribeNew(component)
    componentSubscribes[event] = closure
  }

  emit (event: string, ...args: any[]) {
    this.componentSubscriptionList.forEach((componentSubscription, component: Vue) => {
      componentSubscription[event] && componentSubscription[event].call(component, ...args)
    })
  }

  wipeComponentSubscriptions (component: Vue) {
    this.componentSubscriptionList.delete(component)
  }

  subscribeNew (component: Vue): ComponentSubscription {
    const componentSubscriptions: ComponentSubscription = {}
    this.componentSubscriptionList.set(component, componentSubscriptions)
    return componentSubscriptions
  }
}

export const BusPlugin = {
  install: function PluginFunction<EpicBusPluginOptions> (_Vue: typeof Vue, options?: Partial<EpicBusPluginOptions>) {
    const { broadcastName, optionGroupName } = Object.assign({}, defaultOptions, options) as { optionGroupName: string, broadcastName: string }

    const bus = new Bus()

    _Vue.config.optionMergeStrategies.subs = _Vue.config.optionMergeStrategies.methods

    _Vue.mixin({
      created () {
        const vm = this as Vue
        const subs = (vm.$options as any)[optionGroupName]
        if (subs) {
          // For in didn't work for me here for some reason.
          Object.keys(subs).forEach(key => {
            bus.on(key, subs[key], vm)
          })
        }
      },
      beforeDestroy () {
        bus.wipeComponentSubscriptions(this as Vue)
      },
    })

    _Vue.prototype[broadcastName] = (event: string, ...args: any[]) => {
      bus.emit(event, ...args)
    }

    // For debug purposes.
    _Vue.prototype.$busInstance = bus
  },
}

import { Bus } from './Bus'

const defaultOptions = {
  optionGroupName: 'subs',
  broadcastName: '$cast',
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

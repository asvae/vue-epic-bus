// 1. Make sure to import 'vue' before declaring augmented types
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $cast: (event: string, ...args: any[]) => void
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    subs?: {[key: string]: (...args: any[]) => void}
  }
}

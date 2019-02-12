# vue-epic-bus
Emit and subscribe to global bus from your components

## Installation

* Add to dependencies:
```bash
yarn add vue-epic-bus
// or
npm i vue-epic-bus
```

* Install plugin
```js
// main.js
import Vue from 'vue'
import {BusPlugin} from 'vue-epic-bus'
Vue.use(BusPlugin)
```

## Usage

Emit:

```html
<script>
export default {
  subs: {
    productUpdated (id) {
      console.log('Product updated', id)
    }
  },
}
</script>
```

Subscribe:

```html
<script>
export default {
  methods: {
    productUpdated (id) {
      this.$cast('updated', id)
      console.log('Product updated', id)
    }
  },
}
</script>
```

`$cast` could be used from template.

```html
<button @click="$cast('updated', id)">Update</button>
```

If you're unhappy with default word choice for `$cast` and `subs` you can change it via plugin options:

```js
Vue.use(BusPlugin, {
  optionGroupName: 'subs',
  broadcastName: '$cast',
})
```




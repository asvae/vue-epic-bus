<template>
  <div class="demo-container">
    <div class="demo-container__item">
      <list-item-emit-test :id="1"/>
      <list-item-emit-test :id="2"/>
      <list-item-emit-test :id="3"/>
    </div>
  </div>
</template>

<script>
import ListItemEmitTest from './ListItemEmitTest'

export default {
  components: {
    ListItemEmitTest,
  },
}
</script>

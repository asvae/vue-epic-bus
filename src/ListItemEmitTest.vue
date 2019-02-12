<template>
  <div class="list-item-emit-test">
    List item <button @click="$cast('updated', id)">Update</button>
  </div>
</template>

<script>
export default {
  name: 'list-item-emit-test',
  subs: {
    updated (id) {
      if (id === this.id) {
        console.log(`${this.id}: I am the item, where the update just happened.`)
      } else {
        console.log(`${this.id}: Update happened in another item (${id}).`)
      }
    }
  },
  props: {
    id: Number,
  },
}
</script>

<style lang="scss">
.list-item-emit-test {

}
</style>

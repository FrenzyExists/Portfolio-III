<template>
  <div
    class="search-bar relative flex items-center w-full h-12 rounded bg-dark-bg-mute overflow-hidden"
  >
    <div class="grid place-items-center h-full w-12 text-dark-bg-hard">
      <font-awesome-icon icon="fa-solid fa-search" class="block h-6 w-6" />
    </div>
    <input
      class="font-montserrat-alternate caret-dark-acc focus:ring-0 border-none bg-dark-bg-mute h-full w-full outline-none text-sm text-dark-text placeholder-dark-text placeholder:opacity-50 pr-2 font-semibold"
      type="search"
      id=""
      placeholder="Search something..."
      v-model="query"
      @input="emitUpdateQuery"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'searchbar',
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const query = ref(props.query)

    watch(
      () => props.query,
      (val) => {
        if (val !== query.value) query.value = val
      }
    )

    function emitUpdateQuery() {
      emit('update:query', query.value)
    }
    return { query, emitUpdateQuery }
  }
}
</script>

<style>
.search-bar {
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.3);
}
</style>

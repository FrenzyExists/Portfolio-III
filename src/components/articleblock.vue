<template>
  <div class="mx-10 grid grid-cols-[repeat(auto-fill,minmax(21.3rem,1fr))] gap-5 mt-4">
    <div v-for="article in articles"
      class="feature-block overflow-hidden text-left z-[2] rounded-xl hover:rounded-none font-montserrat-alternate">
      <a :href="article.path"
        class="relative grid grid-rows-[4rem_2rem_8rem_2rem] bg-dark-bg-harder no-underline h-full">
        <span
          class="capitalize text-dark-acc md:hover:text-dark-red  bg-dark-bg-super-soft-trans article-title px-3 items-center flex font-heading text-xl font-semibold leading-normal transition-property-color duration-100 ease-out">
          {{ article.title !== undefined ? article.title : 'Untitled' }}
        </span>
        <div class="font-heading justify-self-end px-3 flex gap-1 items-center text-xs -rotate-1">
          <span class="text-dark-green">{{
            article.date !== undefined ? article.date : 'no date'
            }}</span>
          <font-awesome-icon class="text-dark-yellow text-color-acc-soft text-lg mx-1"
            icon="fa-solid fa-chevron-right" />
          <span class="text-dark-red">status: {{ article.status !== undefined ? article.status : 'Article' }}</span>
        </div>
        <p class="text-dark-text max-h-24 line-clamp-3 leading-7 italic px-3 mb-4 text-sm pt-[0.35rem]">
          {{
            article.description !== undefined
              ? article.description
              : 'no proper description at the moment'
          }}
        </p>
        <div
          class="flex gap-2 self-end tags bg-dark-bg-super-soft-trans after:h-full after:w-full after:absolute after:top-0 after:left-0 opacity-75 pt-5 pb-2 after:-z-50 px-2">
          <button v-for="tag in article.tags" :key="tag"
            class="tag-btn block bg-color-bg-tag italic font-bold rounded-full px-[0.85em] py-[0.30em]" tabindex="0"
            @click.stop.prevent="$emit('select-tag', tag)">
            #{{ tag }}
          </button>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="js">
export default {
  props: {
    articles: {
      type: Array,
      required: true
    }
  },
  emits: ['select-tag']
}
</script>

<style>
.feature-block {
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.1);
  transition: 0.2s;
}

.tags {
  clip-path: polygon(0 20%, 125% 0, 100% 100%, 0 100%);
}

.article-title {
  clip-path: polygon(0 0%, 100% 0, 100% 85%, 0 100%);
}
</style>

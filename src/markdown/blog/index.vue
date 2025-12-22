<template>
  <div
    class="flex-final dark:bg-dark-bg-soft bg-bg-soft overflow-hidden lg:mx-36 md:mx-14 pb-10 md:pb-12 pt-16 md:pt-0"
  >
    <by-letter routerName="blogByLetter" :existingArticles="articles" />

    <div class="p-10 justify-center">
      <searchbar v-model:query="query" @update:query="handleUpdateQuery" />
    </div>
    <article-block :articles="filteredArticles" @select-tag="handleSelectTag" />
  </div>
</template>

<script lang="js">
import { ref, computed, defineAsyncComponent, watch, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import { useRoute, useRouter } from 'vue-router';

function getArticleInfo() {
  try {
    let a = [];
    const entries = Object.entries(import.meta.globEager('../blog/*.md'));
    for (const [path, m] of entries) {
      let blog = 'blog'+path.replace(/\/markdown|\.md|\./g, '')
      a.push({ ...m, path: blog});
    }
    return a;
  } catch (error) {
    // Handle error here
    console.error(error);
  }
}

export default {
  components: {
    'by-letter': defineAsyncComponent(() => import('@/components/byletter.vue')),
    'article-block': defineAsyncComponent(() => import('@/components/articleblock.vue')),
    'searchbar': defineAsyncComponent(() => import('@/components/searchbar.vue')),
  },
  setup() {
    useHead({
      title: 'Big Brain Writting',
    })
    const route = useRoute();
    const router = useRouter();
    const query = ref(route.query.tag || route.query.q || '');
    const articles = getArticleInfo();

    const filteredArticles = computed(() => {
      const q = query.value.toLocaleLowerCase();
      return articles.filter(({ title, tags = [] }) => {
        const tagMatch = tags.some(tag => String(tag).toLowerCase().includes(q));
        const titleMatch = String(title).toLowerCase().includes(q);
        return titleMatch || tagMatch;
      });
    });

    function syncRoute(newValue) {
      router.replace({
        path: '/blog',
        query: newValue ? { tag: newValue } : {}
      })
    }

    function handleUpdateQuery(newValue) {
      query.value = newValue;
      syncRoute(newValue)
    }

    function handleSelectTag(tag) {
      query.value = tag;
      syncRoute(tag)
    }

    onMounted(() => {
      if (query.value) {
        syncRoute(query.value)
      }
    })

    watch(
      () => route.query.tag,
      (val) => {
        if ((val || '') !== query.value) {
          query.value = val || ''
        }
      }
    )

    return {
      query,
      articles,
      filteredArticles,
      handleUpdateQuery,
      handleSelectTag
    };
  }
};
</script>

<route lang="yaml">
meta:
  layout: fetching
</route>

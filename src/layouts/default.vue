<template>
  <navbar :FilteredRoutes="[
    { name: 'about', path: '/about' },
    { name: 'blog', path: '/blog' },
    { name: 'projects', path: '/projects' }
  ]" />
  <div class="font-montserrat-alternate py-8 flex flex-col justify-center relative lg:py-12">
    <div
      class="-mb-5 article bg-dark-bg-mute rounded-none lg:rounded-xl relative w-full px-5 py-12 shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mb-7 md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28">
      <div class="max-w-prose mx-auto lg:text-lg prose prose-toy-story">
        <div class="mb-8">
          <a v-for="items in tags" href="#"
            class="no-underline text-dark-blue hover:bg-dark-bg bg-dark-bg-hard font-medium text-sm px-3 py-1 mb-3 mr-3 rounded-md">{{
              items }}</a>
        </div>
        <div class="text-center text-dark-text-soft">
          <time><span class="font-bold">Published </span> {{ date }}</time>
        </div>
        <h1
          class="after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto after:bg-dark-acc after:h-1 after:w-64 relative pb-7 text-dark-text italic tracking-wide font-semibold mb-8 text-center">
          {{ title }}
        </h1>
        <div class="flex items-center py-1 mb-3 justify-between">
          <div class="">
            <font-awesome-icon class="mr-2 text-dark-green" icon="fa-solid fa-clock" />
            <span class="text-dark-text-soft">Readtime: {{ readtime }}</span>
          </div>
          <a href="#" class="text-dark-text-soft no-underline font-medium text-sm flex items-center"><font-awesome-icon
              class="mr-2 text-dark-text-soft" icon="fa-solid fa-comment-dots" />
            {{ this.$data.commentAmount }} Comments</a>
        </div>
        <div class="flex items-center">
          <aside>
            <a href="#" @click.prevent="shareOnX"
              class="no-underline text-dark-blue-soft bg-dark-bg-mute hover:text-dark-acc-soft hover:bg-dark-bg-super-soft-trans border mr-2 items-center border-dark-bg-hard font-medium text-sm px-3 py-2 rounded-lg inline-flex">
              <font-awesome-icon class="mr-2 text-dark-blue" icon="fa-brands fa-x-twitter" />
              Post on X
            </a>
            <a href="#" @click.prevent="shareOnBluesky"
              class="no-underline text-dark-blue-soft bg-dark-bg-mute hover:text-dark-acc-soft hover:bg-dark-bg-super-soft-trans border mr-2 items-center border-dark-bg-hard font-medium text-sm px-3 py-2 rounded-lg inline-flex">
              <font-awesome-icon class="mr-2 text-dark-blue" icon="fa-brands fa-bluesky" />
              Post on Bluesky
            </a>
            <a href="#" @click.prevent="copyToClipboard"
              class="no-underline text-dark-blue-soft bg-dark-bg-mute hover:text-dark-acc-soft hover:bg-dark-bg-super-soft-trans border mr-2 items-center border-dark-bg-hard font-medium text-sm px-3 py-2 rounded-lg inline-flex">
              <font-awesome-icon class="mr-2 text-dark-red" icon="fa-solid fa-link" />
              Share
            </a>

          </aside>
        </div>
        <p class="lead font-semibold">{{ description }}</p>
      </div>
      <div class="mt-8 prose prose-toy-story mx-auto lg:prose-lg">
        <router-view v-slot="{ Component }">
          <component :is="Component" ref="current" />
        </router-view>
      </div>
    </div>
    <comments-section @comment-amount="handleCommentAmount" class="relative w-full md:max-w-3xl md:mx-auto lg:max-w-4xl"
      :title="`${title}`" :octo="octo" />
  </div>
  <foot />
</template>

<script lang="js">
import { defineAsyncComponent, ref } from 'vue'
import { Octokit } from '@octokit/rest';

const octokitInstance = new Octokit({
  auth: `${import.meta.env.VITE_GITHUB_TOKEN}`
});

export default {
  components: {
    'comments-section': defineAsyncComponent(() => import('@/components/commentsection.vue')),
    'navbar': defineAsyncComponent(() => import('@/components/navbar.vue')),
    'foot': defineAsyncComponent(() => import('@/components/foot.vue')),
  },
  mounted() {
    this.date = this.$refs.current.frontmatter.date
    this.title = this.$refs.current.frontmatter.title
    this.tags = this.$refs.current.frontmatter.tags
    this.description = this.$refs.current.frontmatter.description
    this.calculateReadtime()  // Calculate readtime on mount
  },
  data() {
    return {
      octo: octokitInstance,
      title: '',
      date: '',
      tags: [],
      readtime: '',
      description: '',
      commentAmount: 0
    }
  },
  setup() {
    const current = ref()
    return {
      current
    }
  },
  methods: {
    calculateReadtime() {
      // Wait for the component to render, then extract its text content
      this.$nextTick(() => {
        const textContent = this.$refs.current.$el.textContent || '';
        const wordCount = textContent.split(/\s+/).length;
        const wordsPerMinute = 200; // average reading speed
        this.readtime = `${Math.ceil(wordCount / wordsPerMinute)} min read`;
      });
    },
    shareOnX() {
      const pageUrl = encodeURIComponent(window.location.href);
      const text = encodeURIComponent("Check out this page!");
      const xUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}`;
      window.open(xUrl, "_blank");
    },
    shareOnBluesky() {
      const pageUrl = encodeURIComponent(window.location.href);
      const text = encodeURIComponent("Check out this page!");
      const blueskyUrl = `https://bsky.app/intent/compose?text=${text}%20${pageUrl}`;
      window.open(blueskyUrl, "_blank");
    },
    copyToClipboard() {
      const pageUrl = window.location.href;
      navigator.clipboard
        .writeText(pageUrl)
        .then(() => {
          console.log("Page URL copied to clipboard!");
          // Optionally show a notification or message to the user
        })
        .catch((err) => {
          console.error("Failed to copy URL:", err);
        });
    },
    handleCommentAmount(value) {
      this.commentAmount = value;
    }
  }
}
</script>

<template>
  <a
    :href="projectUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="group block h-full"
  >
    <div
      class="relative flex h-full flex-col overflow-hidden rounded-2xl border border-dark-bg-super-hard bg-dark-bg-mute p-6 shadow-lg transition duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl"
    >
      <div class="relative flex flex-col gap-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-2xl font-semibold leading-tight text-dark-acc">{{ projectName }}</h3>
          </div>
        </div>

        <p class="text-dark-text-soft text-sm leading-relaxed line-clamp-3">
          {{ projectDesc || 'No description available yet.' }}
        </p>

        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex items-center gap-2 rounded-xl bg-dark-bg-super-soft/60 px-3 py-2 border border-dark-bg-super-hard/70">
            <font-awesome-icon class="text-dark-yellow" icon="fa-solid fa-star" />
            <div class="flex flex-col leading-tight">
              <span class="text-dark-text font-semibold">{{ projectStars ?? 0 }}</span>
              <span class="text-dark-text-soft text-[0.78rem]">Stars</span>
            </div>
          </div>
          <div class="flex items-center gap-2 rounded-xl bg-dark-bg-super-soft/60 px-3 py-2 border border-dark-bg-super-hard/70">
            <font-awesome-icon class="text-dark-green" icon="fa-solid fa-code-fork" />
            <div class="flex flex-col leading-tight">
              <span class="text-dark-text font-semibold">{{ projectForks ?? 0 }}</span>
              <span class="text-dark-text-soft text-[0.78rem]">Forks</span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <span v-if="!hasTopics" class="text-xs text-dark-text-soft/70 italic">No tags yet</span>
          <span v-for="topic in projectTopics" :key="topic"
            class="rounded-full border border-dark-bg-super-hard/80 bg-dark-bg-super-soft/70 px-3 py-1 text-xs font-semibold text-dark-text">
            #{{ topic }}
          </span>
        </div>
      </div>

      <div class="relative mt-6 flex items-center justify-between text-sm text-dark-text-soft">
        <span class="flex items-center gap-2">
          <font-awesome-icon class="text-dark-acc" icon="fa-solid fa-link" />
          View on GitHub
        </span>
        <span
          class="rounded-full bg-dark-acc/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-dark-acc">
          Open
        </span>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    projectName: {
      type: String,
      required: true
    },
    projectDesc: {
      type: String,
      required: false
    },
    projectStars: {
      type: Number,
      required: false
    },
    projectForks: {
      type: Number,
      required: false
    },
    projectUrl: {
      type: String,
      required: false
    },
    projectTopics: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  computed: {
    hasTopics() {
      return Array.isArray(this.projectTopics) && this.projectTopics.length > 0
    }
  }
}
</script>

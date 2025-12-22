<template>
  <span class="pb-20 pt-4">
    <div class="relative overflow-hidden bg-dark-bg-super-soft/40 border border-dark-bg-super-hard/40 rounded-3xl max-w-7xl mx-auto md:px-10 px-6 py-10 mt-10">
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-dark-acc/15 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-12 -right-16 h-48 w-48 rounded-full bg-dark-green/10 blur-3xl pointer-events-none"></div>
      <div class="prose prose-toy-story dark:prose-invert max-w-none relative">
        <h2 class="text-4xl font-bold text-dark-acc mb-2">Projects</h2>
        <p class="text-dark-text-soft text-lg mb-6">Peek into selected builds, OSS experiments, and things I am tinkering with. Everything below pulls live from GitHub.</p>
        <div class="flex flex-wrap gap-3">
          <a :href="githubProfileUrl" target="_blank" rel="noreferrer"
            class="inline-flex items-center gap-2 rounded-full bg-dark-bg-mute px-4 py-2 text-sm font-semibold text-dark-text hover:bg-dark-acc hover:text-dark-bg transition">
            <font-awesome-icon class="text-inherit" icon="fa-brands fa-github" />
            View GitHub
          </a>
          <span class="inline-flex items-center gap-2 rounded-full bg-dark-bg-mute px-4 py-2 text-sm font-semibold text-dark-text-soft">
            <font-awesome-icon class="text-dark-yellow" icon="fa-solid fa-bolt" />
            Auto-synced from GitHub
          </span>
        </div>
      </div>
    </div>

    <div>
      <!-- Loading animation -->
      <div v-if="loading" class="dark:text-dark-bg-soft text-bg-soft flex justify-center items-center h-screen">
        <font-awesome-icon icon="fa-solid fa-spinner" spin size="4x" class="text-color-acc" />
      </div>

      <!-- Display content once loading is complete -->
      <div v-else>
        <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 my-12">
          <div
            class="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
            <ProjectCard
              v-for="p in github_response"
              :key="p.id"
              :projectName="p.name"
              :projectDesc="p.description"
              :projectStars="p.stars"
              :projectForks="p.forks"
              :projectUrl="p.url"
              :projectTopics="p.tags"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="pb-20 prose prose-toy-story dark:prose-invert font-montserrat-alternate max-w-7xl mx-auto flex flex-col">
      <button v-if="hasMoreProjects" @click="loadMoreProjects"
        class="w-fit px-36 mx-auto rounded-full drop-shadow-md my-4 sm:my-0 font-bold text-lg hover:transition duration-300 hover:ease-in-out hover:text-dark-bg-mute bg-dark-bg-mute text-dark-acc-soft hover:bg-dark-acc-soft p-4 min-w-[10rem]">
        View More
      </button>
      <p v-if="!hasMoreProjects && github_response.length > 0" class="text-center mt-4">
        You've reached the end
      </p>
    </div>
  </span>
</template>

<script>
import { Octokit } from '@octokit/core'
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    ProjectCard: defineAsyncComponent(() => import('@/components/ProjectCard.vue'))
  },
  data: () => ({
    temporary_response: [],
    github_response: [],
    nextUrl: '/users/{username}/repos', // Starting endpoint
    hasMoreProjects: true, // Determines if more projects are available to load
    loading: false
  }),
  computed: {
    githubProfileUrl() {
      return `https://github.com/${import.meta.env.VITE_GITHUB_USER}`
    }
  },
  async created() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true // Start loading
        await this.loadMoreProjects()
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        this.loading = false
      }
    },

    // Function to fetch paginated data from GitHub API
    async getPaginatedData(url) {
      // TODO: Find a better way to manage octokit object so I don't have to make a new object every single darn time
      const octokit = new Octokit({
        auth: `${import.meta.env.VITE_GITHUB_TOKEN}`
      })
      this.nextUrl = url
      try {
        let gotem = false
        let filteredProjects = []
        let linkHeader
        while (!gotem) {
          const response = await octokit.request(`GET ${this.nextUrl}`, {
            username: `${import.meta.env.VITE_GITHUB_USER}`,
            per_page: 100,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' }
          })

          filteredProjects = [
            ...filteredProjects,
            ...response.data
              .filter((repo) => repo.topics && repo.topics.some((tag) => tag === 'good')) // Filter repos with 'good' tag
              .map((repo) => ({
                url: repo.html_url,
                id: repo.id,
                name: repo.name,
                description: repo.description || 'No description available',
                icon: 'fa fa-github', // Set a default icon or customize this
                projects: repo.topics || [],
                stars: repo.stargazers_count,
                tags: repo.topics,
                forks: repo.forks
              }))
          ]
          console.log(filteredProjects)

          linkHeader = response.headers.link
          if (linkHeader && linkHeader.includes('rel="next"')) {
            // Find the next URL to fetch from the link header
            const nextPattern = /(?<=<)([\S]*)(?=>; rel="next")/i
            this.nextUrl = linkHeader.match(nextPattern)[0]
          } else {
            // No more pages to load
            this.hasMoreProjects = false
          }
          // Note, this has a pretty odd bug, remember to test it better
          if (filteredProjects.length >= 10 || !linkHeader.includes('rel="next"')) {
            gotem = true
            this.temporary_response = [...this.temporary_response, ...filteredProjects.splice(15)]
          }
        }
        this.github_response = [...this.github_response, ...filteredProjects]

        // Check if there is a next page of results
      } catch (error) {
        console.error('Error fetching repositories:', error)
      }
    },

    async loadMoreProjects() {
      if (this.hasMoreProjects && this.nextUrl) {
        await this.getPaginatedData(this.nextUrl)
      }
    }
  }
}
</script>

<style>
.selected-skill-details {
  padding: 20px;
  background-color: #3c5f87;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Close button styling */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff5c5c;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: #ff3838;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>

<route lang="yaml">
meta:
  layout: fell
</route>

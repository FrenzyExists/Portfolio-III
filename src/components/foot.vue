<template>
  <footer class="body-font bg-dark-bg-mute -mb-3">
    <div class="relative bg-dark-bg-mute -mb-3">
      <svg
        class="absolute top-0 w-full h-6 sm:-mt-10 sm:h-16 text-dark-bg-mute m-auto"
        preserveAspectRatio="none"
        viewBox="0 0 1440 54"
      >
        <path
          fill="currentColor"
          d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
        ></path>
      </svg>
    </div>
    <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col z-10 relative">
      <a
        class="flex title-font font-medium items-center md:justify-start justify-center text-dark-text-soft"
      >
        <font-awesome-icon
          class="mr-2 text-dark-yellow block w-8 h-8 p-2 bg-dark-bg-hard rounded-full"
          icon="fa-solid fa-bolt"
        />
        <span class="ml-3 text-xl">Garcia's</span>
      </a>
      <p
        class="text-sm text-dark-text sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4"
      >
        © {{ new Date().getFullYear() }}
        Angel Garcia —
        <a
          :href=twitterUrl
          class="text-dark-blue ml-1"
          rel="noopener noreferrer"
          target="_blank"
          >@{{ twitterUser }}</a
        >
      </p>
      <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
        <a
          class="ml-3 text-dark-acc-soft hover:opacity-80"
          v-for="social in socials"
          :key="social.icon"
          :href="social.url"
        >
          <font-awesome-icon :icon="social.icon" class="w-5 h-5" />
        </a>
      </span>
    </div>
  </footer>
</template>

<script>
const socials = [
  {
    icon: 'fa-brands fa-whatsapp',
    url: `https://wa.me/${import.meta.env.VITE_PHONE_NUMBER}`
  },
  {
    icon: 'fa-brands fa-x-twitter',
    url: `https://x.com/${import.meta.env.VITE_TWITTER}`
  },
  {
    icon: 'fa-brands fa-github',
    url: `https://github.com/${import.meta.env.VITE_GITHUB_USER}`
  }
]

export default {
  name: 'foot',
  data() {
    return {
      socials,
      twitterUser: import.meta.env.VITE_TWITTER,
      twitterUrl: `https://twitter.com/${import.meta.env.VITE_TWITTER}`
    }
  },
}
</script>

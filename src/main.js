import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import './styles/style.css'
import 'prismjs/themes/prism-tomorrow.css'
import cors from 'cors'
import router from './router'

import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBurger,
  faLaptopCode,
  faLink,
  faBolt,
  faSun,
  faMoon,
  faMicrochip,
  faEnvelope,
  faSearch,
  faChevronRight,
  faEllipsis,
  faCommentDots,
  faFaceLaugh,
  faClock,
  faTerminal,
  faCheck,
  faPaperPlane,
  faStar,
  faCodeFork,
  faSpinner,
  faBold,
  faItalic,
  faCode,
  faQuoteLeft,
  faFileCode,
  faSmile
} from '@fortawesome/free-solid-svg-icons'
import {
  faXTwitter,
  faBluesky,
  faGithub,
  faLinkedin,
  faWhatsapp,
  faJava,
  faCss3,
  faHtml5,
  faPython,
  faGit,
  faVuejs,
  faFigma,
  faReact,
  faWordpress,
  faNodeJs,
  faAndroid,
  faJs
} from '@fortawesome/free-brands-svg-icons'

App.name = "Pikachu's Portfolio"

const app = createApp(App)
const head = createHead()

library.add(
  faJs,
  faCss3,
  faHtml5,
  faAndroid,
  faGithub,
  faCheck,
  faJava,
  faSmile,
  faPython,
  faGit,
  faVuejs,
  faReact,
  faWordpress,
  faNodeJs,
  faTerminal,
  faWhatsapp,
  faLinkedin,
  faBurger,
  faFigma,
  faSearch,
  faBold,
  faItalic,
  faCode,
  faQuoteLeft,
  faFileCode,
  faChevronRight,
  faEllipsis,
  faFaceLaugh,
  faPaperPlane,
  faXTwitter,
  faBluesky,
  faLink,
  faCommentDots,
  faLaptopCode,
  faSpinner,
  faBolt,
  faSun,
  faMoon,
  faMicrochip,
  faClock,
  faEnvelope,
  faStar,
  faCodeFork
)
app.component('font-awesome-icon', FontAwesomeIcon)

// app.use(
//   cors({
//     origin: 'http://localhost:5173'
//   }) 
// )
app.use(head)
app.use(router)
app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import VConsole from 'vconsole'

import './assets/main.css'
import '@unocss/reset/sanitize/sanitize.css'

import 'virtual:uno.css'

console.log(import.meta.env)

if (import.meta.env.DEV) new VConsole()

createApp(App).mount('#app')

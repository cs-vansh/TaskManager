import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import './assets/main.css'

//Persistence using Local Storage
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'

const app = createApp(App)

app.use(Toast)

//create Pinia instance
const pinia = createPinia()

//using persistence plugin with pinia
pinia.use(piniaPluginPersistedstate)

//Attach pinia to the app
app.use(pinia)

app.mount('#app')

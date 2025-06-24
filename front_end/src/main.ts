import { createApp } from "vue";
import "./assets/style.css";
import App from "./App.vue";

 import router from './router/index'
import { createPinia } from 'pinia'
 import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useProfileStore } from './stores/profile'

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(router)
app.use(pinia)

// const userStore = useProfileStore()
     app.mount('#app')
 
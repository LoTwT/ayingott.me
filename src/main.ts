import { createApp } from "vue"
import { createHead } from "@unhead/vue"
import App from "./App.vue"
import { router } from "./router"

const app = createApp(App)

app.use(router)

const head = createHead()
app.use(head)

app.mount("#app")

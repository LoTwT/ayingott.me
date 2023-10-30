import { createApp } from "vue"
import { createHead } from "@unhead/vue"
import App from "./App.vue"
import { router } from "./router"
import { i18n } from "./i18n"

const app = createApp(App)

app.use(router)
app.use(i18n)

const head = createHead()
app.use(head)

app.mount("#app")

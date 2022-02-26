import { createApp } from 'vue'
import { initRoot } from './setup'
import { WXB_LOG } from './utils'
import App from './App.vue'

import './main.css'

try {
    const root = initRoot()

    const app = createApp(App)

    app.mount(root)
} catch(err) {
    WXB_LOG('Cannot load body element', err)
}

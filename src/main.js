import { createApp } from 'vue'
import { initRoot } from './setup'
import { setupStores } from '@/stores'
import { WXB_LOG } from './utils'
import App from './App.vue'

import './main.css'

const setupApp = async () => {
  await setupStores()

  const root = initRoot()
  const app = createApp(App)

  app.mount(root)
}

try {
  setupApp()
} catch (err) {
  WXB_LOG('App setup error', err)
}

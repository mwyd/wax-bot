import * as botStore from './botStore'
import * as guardStore from './guardStore'
import * as userStore from './userStore'

const setupStores = async () => {
  await userStore.loadToken()
  await userStore.loadUserPreferences()

  userStore.authenticateConduit()
  userStore.authenticateWaxpeer()

  botStore.loadConfig()

  guardStore.loadConfig()
  guardStore.loadGuardItemsData()
  guardStore.loadGuardItems()
}

export {
  setupStores
}
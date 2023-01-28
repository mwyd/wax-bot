import * as botStore from './botStore'
import * as guardStore from './guardStore'
import * as userStore from './userStore'

export const setupStores = async () => {
  await userStore.loadToken()
  await userStore.loadUserPreferences()

  userStore.authenticateConduit()
  userStore.authenticateWaxpeer()

  botStore.loadBotConfigs()

  guardStore.loadConfig()
  guardStore.loadGuardItemsData()
  guardStore.loadGuardItems()
}
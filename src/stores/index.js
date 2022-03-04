import * as botStore from './botStore'
import * as guardStore from './guardStore'
import * as userStore from './userStore'

const setupStores = () => {
    userStore.authenticate()
    
    userStore.loadToken()

    botStore.loadConfig()
    
    guardStore.loadConfig()

    guardStore.loadGuardItemsData()

    guardStore.loadGuardItems()
}

export {
    setupStores
}
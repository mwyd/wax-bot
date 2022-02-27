import { loadConfig as loadBotConfig } from './botStore'
import { loadConfig as loadGuardConfig, loadOrders } from './guardStore'
import { authenticate, loadToken } from './userStore'

const setupStores = () => {
    authenticate()

    loadBotConfig()
    loadToken()
    
    loadGuardConfig()
    loadOrders()
}

export {
    setupStores
}
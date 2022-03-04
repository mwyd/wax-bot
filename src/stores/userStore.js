import { reactive, watch } from 'vue'
import { user as conduitUser } from '@/api/conduit'
import { user as waxpeerUser } from '@/api/waxpeer'

const session = reactive({
    conduitName: null,
    token: null,
    waxpeerId: null
})

const loadToken = () => {
    chrome.storage.sync.get(['token'], (result) => {
        session.token = result.token
    })
}

watch(() => session.token, () => {
    chrome.storage.sync.set({ token: session.token })
})

const authenticateConduit = async () => {
    const { success, data } = await conduitUser.authenticate(session.token)

    if(success) {
        session.conduitName = data.name
    } 
}

const authenticateWaxpeer = async () => {
    const { success, user } = await waxpeerUser.authenticate()

    if(success) {
        session.waxpeerId = user.id
    }
}

const authenticate = () => {
    authenticateConduit()
    authenticateWaxpeer()
}

export {
    session,
    loadToken,
    authenticate
}
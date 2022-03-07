import { reactive, watch } from 'vue'
import { user as conduitUser } from '@/api/conduit'
import { user as waxpeerUser } from '@/api/waxpeer'
import { syncStorage } from '@/utils'

const session = reactive({
    conduitName: null,
    token: null,
    waxpeerId: null
})

const loadToken = async () => {
    session.token = await syncStorage.get('token')
}

watch(() => session.token, () => {
    syncStorage.set({ token: session.token })
})

const authenticateConduit = async () => {
    const { success, data } = await conduitUser.authenticate(session.token)

    if(success) {
        session.conduitName = data.name
    } else {
        session.conduitName = null
    }
}

const authenticateWaxpeer = async () => {
    const { success, user } = await waxpeerUser.authenticate()

    if(success) {
        session.waxpeerId = user.id
    }
}

export {
    session,
    loadToken,
    authenticateConduit,
    authenticateWaxpeer
}
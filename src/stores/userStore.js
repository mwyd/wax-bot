import { reactive, watch } from 'vue'
import { user as conduitUser } from '@/api/conduit'
import { user as waxpeerUser } from '@/api/waxpeer'
import { syncStorage } from '@/utils'
import { pushAlert } from './alertsStore'
import alertTypeEnum from '@/enums/alertTypeEnum'

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

    const alert = {
        type: alertTypeEnum.SUCCESS,
        title: 'Conduit',
        body: 'Authenticated'
    }

    if(success) {
        session.conduitName = data.name
    } else {
        session.conduitName = null

        alert.type = alertTypeEnum.ERROR
        alert.body = 'Unauthenticated'
    }

    pushAlert(alert)
}

const authenticateWaxpeer = async () => {
    const { success, user } = await waxpeerUser.authenticate()

    const alert = {
        type: alertTypeEnum.SUCCESS,
        title: 'Waxpeer',
        body: 'Authenticated'
    }

    if(success) {
        session.waxpeerId = user.id
    } else {
        alert.type = alertTypeEnum.ERROR
        alert.body = 'Unauthenticated'
    }

    pushAlert(alert)
}

export {
    session,
    loadToken,
    authenticateConduit,
    authenticateWaxpeer
}
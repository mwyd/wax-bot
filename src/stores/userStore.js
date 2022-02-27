import { user as conduitUser } from '@/api/conduit'
import { user as waxpeerUser } from '@/api/waxpeer'
import { reactive } from 'vue'

const session = reactive({
    conduitName: null,
    token: null,
    waxpeerId: null
})

const loadToken = () => {
    session.token = localStorage.getItem('wxb-token')
}

const saveToken = (token) => {
    session.token = token

    localStorage.setItem('wxb-token', token)
} 

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
    saveToken,
    authenticate
}
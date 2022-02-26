import { user as conduitUser } from '@/api/conduit'
import { reactive } from 'vue'

const session = reactive({
    name: null,
    authenticated: false,
    token: null,
    shop: null
})

const loadToken = () => {
    session.token = localStorage.getItem('wxb-token')
}

const saveToken = (token) => {
    session.token = token

    localStorage.setItem('wxb-token', token)
} 

const authenticate = async () => {
    const { success, data } = conduitUser.authenticate(session.token)

    if(success) {
        session.name = data.name
    }
}

export {
    session,
    loadToken,
    saveToken,
    authenticate
}
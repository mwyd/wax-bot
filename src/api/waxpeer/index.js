import useMarket from "./useMarket"
import useUser from "./useUser"

const defaults = {
    baseUrl: 'https://waxpeer.com/api',
    credentials: 'include',
    headers: {
        'Accept': 'application/json'
    }
}

const market = useMarket(defaults)
const user = useUser(defaults)

export {
    market,
    user
}
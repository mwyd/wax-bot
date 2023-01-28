import useMarket from "./useMarket"
import useUser from "./useUser"

const defaults = {
  baseUrl: 'https://waxpeer.com/api',
  credentials: 'include',
  headers: {
    'Accept': 'application/json'
  }
}

export const market = useMarket(defaults)

export const user = useUser(defaults)
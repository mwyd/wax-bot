import externalServiceEnum from '@/enums/externalServiceEnum'
import useSteamMarket from './useSteamMarket'
import useUser from './useUser'
import useCsItem from './useCsItem'

const defaults = {
    baseUrl: 'https://conduit.ddns.net/api/v1',
    service: externalServiceEnum.CONDUIT
}

const steamMarket = useSteamMarket(defaults)
const user = useUser(defaults)
const csItem = useCsItem(defaults)

export {
    steamMarket,
    user,
    csItem
}
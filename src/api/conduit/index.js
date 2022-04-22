import externalServiceEnum from '@/enums/externalServiceEnum'
import useSteamMarket from './useSteamMarket'
import useUser from './useUser'
import useCsItem from './useCsItem'
import useBuffMarket from './useBuffMarket'

const defaults = {
    baseUrl: 'https://conduit.ddns.net/api/v1',
    service: externalServiceEnum.CONDUIT
}

const buffMarket = useBuffMarket(defaults)
const steamMarket = useSteamMarket(defaults)
const user = useUser(defaults)
const csItem = useCsItem(defaults)

export {
    buffMarket,
    steamMarket,
    user,
    csItem
}
import { fetchBackground } from '@/utils'

export default function({ baseUrl, service }) {
    const getItem = (hashName) => fetchBackground({
        service,
        data: {
            path: baseUrl + `/steam-market-csgo-items/${hashName}`
        }
    })
    
    return {
        getItem
    }
}
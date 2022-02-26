import { fetchBackground } from '@/utils'

export default function({ baseUrl, service }) {
    const getVariant = (token, shortName, paintseed) => fetchBackground({
        service,
        data: {
            path: baseUrl + `/csgo-rare-paint-seed-items?search=${shortName}&paint_seed=${paintseed}`,
            config: {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        }
    })

    return {
        getVariant
    }
}
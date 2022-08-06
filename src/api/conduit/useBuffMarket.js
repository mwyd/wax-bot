import { fetchBackground } from '@/utils'

export default function ({ baseUrl, service }) {
  const getItem = (hashName) => fetchBackground({
    service,
    data: {
      path: baseUrl + `/buff-market-csgo-items/${hashName}`
    }
  })

  return {
    getItem
  }
}
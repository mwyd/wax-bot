import { fetchBackground } from '@/utils'

export default function ({ baseUrl, service }) {
  const itemInfo = (inspectLink) => fetchBackground({
    service,
    data: {
      path: baseUrl + `/?url=${inspectLink}`
    }
  })

  return {
    itemInfo
  }
}
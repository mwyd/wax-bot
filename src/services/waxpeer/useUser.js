import { ordersResultLimit, tradesResultLimit } from '@/config'
import { WXB_LOG } from '@/utils'

export default function useUser({ baseUrl, credentials, headers }) {
  const authenticate = async () => {
    const response = await fetch(`${baseUrl}/user`, { credentials, headers })

    return response.json()
  }

  const getTrades = async (query) => {
    const params = new URLSearchParams(query)

    const response = await fetch(`${baseUrl}/get-history-for/?${params.toString()}`, { credentials, headers })

    return response.json()
  }

  const getAllTrades = async (query) => {
    let page = 1
    let trades = []

    try {
      for (let i = 0; i < page; i++) {
        const { success, data } = await getTrades({
          skip: i * tradesResultLimit,
          count: tradesResultLimit,
          ...query
        })

        if (success) {
          trades = [...trades, ...data[0]]
        }

        if (!success || data[0].length < tradesResultLimit) {
          break
        }

        page++
      }
    } catch (err) {
      WXB_LOG('Cannot load trades page', err)
    }

    return trades
  }

  const getItems = async (query) => {
    const params = new URLSearchParams(query)

    const response = await fetch(`${baseUrl}/get-my-sell-offers/?${params.toString()}`, { credentials, headers })

    return response.json()
  }

  const getAllItems = async (query) => {
    let page = 1
    let sellItems = []

    try {
      for (let i = 0; i < page; i++) {
        const { success, items } = await getItems({
          skip: i * ordersResultLimit,
          count: ordersResultLimit,
          ...query
        })

        if (success) {
          sellItems = [...sellItems, ...items]
        }

        if (!success || items.length < ordersResultLimit) {
          break
        }

        page++
      }
    } catch (err) {
      WXB_LOG('Cannot load orders page', err)
    }

    return sellItems
  }

  const editSellOffer = async (body) => {
    const response = await fetch(`${baseUrl}/edit-sell-offer`, {
      method: 'POST',
      credentials,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(body)
    })

    return response.json()
  }

  return {
    authenticate,
    getTrades,
    getAllTrades,
    getItems,
    getAllItems,
    editSellOffer
  }
}
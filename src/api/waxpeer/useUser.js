export default function useUser({ baseUrl, credentials, headers }) {
  const authenticate = async () => {
    const response = await fetch(`${baseUrl}/user`, { credentials, headers })

    return response.json()
  }

  const getTrades = async (query) => {
    const response = await fetch(`${baseUrl}/get-history-for/?${query.toString()}`, { credentials, headers })

    return response.json()
  }

  const getItems = async (query) => {
    const response = await fetch(`${baseUrl}/get-my-sell-offers/?${query.toString()}`, { credentials, headers })

    return response.json()
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
    getItems,
    editSellOffer
  }
}
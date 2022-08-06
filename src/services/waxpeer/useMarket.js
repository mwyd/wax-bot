export default function useMarket({ baseUrl, credentials, headers }) {
  const getItems = async (query) => {
    const response = await fetch(`${baseUrl}/data/index/?${query.toString()}`, { credentials, headers })

    return response.json()
  }

  const buyItem = async (body) => {
    const response = await fetch(`${baseUrl}/buy-steam`, {
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
    getItems,
    buyItem
  }
}
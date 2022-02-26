export default function useMarket({ baseUrl, credentials, headers }) {
    const getItems = async (query) => {
        const response = await fetch(`${baseUrl}/data/index/?${query.toString()}`, { credentials, headers })

        const data = await response.json()

        return data
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

        const data = await response.json()

        return data
    }

    return {
        getItems,
        buyItem
    }
}
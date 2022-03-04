export default function useUser({ baseUrl, credentials, headers }) {
    const authenticate = async () => {
        const response = await fetch(`${baseUrl}/user`, { credentials, headers })

        const data = await response.json()

        return data
    }

    const getTrades = async (query) => {
        const response = await fetch(`${baseUrl}/get-history-for/?${query.toString()}`, { credentials, headers })

        const data = await response.json()

        return data
    }

    const getItems = async (query) => {
        const response = await fetch(`${baseUrl}/get-my-sell-offers/?${query.toString()}`, { credentials, headers })

        const data = await response.json()

        return data
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

        const data = await response.json()

        return data
    }

    return {
        authenticate,
        getTrades,
        getItems,
        editSellOffer
    }
}
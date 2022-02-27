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

    return {
        authenticate,
        getTrades,
        getItems
    }
}
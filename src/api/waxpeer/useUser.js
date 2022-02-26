export default function useUser({ baseUrl, credentials, headers }) {
    const getTrades = async (query) => {
        const response = await fetch(`${baseUrl}/get-history-for/?${query.toString()}`, { credentials, headers })

        const data = await response.json()

        return data
    }

    return {
        getTrades
    }
}
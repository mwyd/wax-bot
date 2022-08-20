import { steamMarket, buffMarket } from '@/services/conduit'

const steamMarketItemsData = new Map()

const buffMarketItemsData = new Map()

const getSteamMarketItemData = async (conduitHashName) => {
  let marketData = steamMarketItemsData.get(conduitHashName)

  if (!marketData) {
    const { success, data } = await steamMarket.getItem(conduitHashName)

    if (success) {
      marketData = {
        price: data.price,
        volume: data.volume
      }

      steamMarketItemsData.set(conduitHashName, marketData)
    }
  }

  return marketData
}

const getBuffMarketItemData = async (hashName) => {
  let marketData = buffMarketItemsData.get(hashName)

  if (!marketData) {
    const { success, data } = await buffMarket.getItem(hashName)

    if (success) {
      marketData = {
        price: data.price,
        volume: data.volume,
        good_id: data.good_id
      }

      buffMarketItemsData.set(hashName, marketData)
    }
  }

  return marketData
}

export {
  getSteamMarketItemData,
  getBuffMarketItemData
}
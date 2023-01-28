import { steamMarket, buffMarket } from '@/services/conduit'
import { userPreferences } from '@/stores/userStore'
import targetMarketEnum from '@/enums/targetMarketEnum'

const steamMarketItemsData = new Map()

const buffMarketItemsData = new Map()

export const getSteamMarketItemData = async (conduitHashName) => {
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

export const getBuffMarketItemData = async (hashName) => {
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

export const getMarketItemData = (item) => {
  if (userPreferences.targetMarket === targetMarketEnum.BUFF) {
    return getBuffMarketItemData(item.name)
  }

  return getSteamMarketItemData(item.$conduit_hash_name)
}
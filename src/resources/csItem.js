import { csItem } from '@/services/conduit'
import { inspectTool } from '@/services/csgo_float'
import { destroyAlert, pushAlert } from '@/stores/alertsStore'
import { session } from '@/stores/userStore'
import { calculateDiscount, roundNumber } from '@/utils'
import csItemDetailRarityEnum from '@/enums/csItemDetailRarityEnum'
import alertTypeEnum from '@/enums/alertTypeEnum'

const dopplerPhases = {
  phase1: 'Phase 1',
  phase2: 'Phase 2',
  phase3: 'Phase 3',
  phase4: 'Phase 4',
  emerald: 'Emerald',
  ruby: 'Ruby',
  sapphire: 'Sapphire',
  blackpearl: 'Black Pearl'
}

const rareDopplerPhases = [
  'Emerald',
  'Ruby',
  'Sapphire',
  'Black Pearl'
]

const paintSeedVariantKeywords = [
  'Case Hardened',
  'Fade'
]

const highRankFloat = 1e-3

const valuableFloatRanges = [
  [0, 0.01],
  [0.07, 0.09],
  [0.15, 0.18],
  [0.18, 0.21],
  [0.45, 0.5],
  [0.76, 0.8]
]

const getDopplerPhase = (imageUrl) => {
  for (const [key, name] of Object.entries(dopplerPhases)) {
    if (imageUrl.includes(key)) return name
  }

  return null
}

const hasPaintSeedVariant = (hashName) => {
  for (let keyword of paintSeedVariantKeywords) {
    if (hashName.search(keyword) > -1) return true
  }

  return false
}

const createRareItemAlertBody = (hashName, variant, price, discount) => `
  <span>${hashName}</span>
  <br />
  <span class="wxb-variant">${variant}</span>
  <br />
  <span><span style="color: greenyellow;">$</span> ${price} (${discount} %)</span>
`

const getShortName = (hashName) => {
  return hashName
    .replace('StatTrak™ ', '')
    .split('(')[0]
    .trim()
}

const decodeInspectId = (id) => {
  const [D, A, S] = id.split('_')

  return {
    S,
    A,
    D,
    inspectLink: `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${S}A${A}D${D}`
  }
}

const normalizeItemPrice = (item) => {
  item.$price = roundNumber(item.price / 1000, 3)
  item.$suggested_price = roundNumber(item.steam_price_number / 1000, 3)
  item.$discount = calculateDiscount(item.price, item.steam_price_number)
}

const updateItemDetails = async (item) => {
  item.$phase = getDopplerPhase(item.inspect_item?.imageurl ?? '')
  item.$conduit_hash_name = item.$phase ? item.name.replace('(', `${item.$phase} (`) : item.name
  item.$searchable = item.$conduit_hash_name.toLowerCase()
  item.$alerts = []

  if (!item.inspect_item) {
    return
  }

  let { id, floatvalue, paintseed } = item.inspect_item

  const { S, inspectLink } = decodeInspectId(id)

  if (floatvalue === null) {
    const { success, data } = await inspectTool.itemInfo(inspectLink)

    if (success && data.iteminfo) {
      floatvalue = data.iteminfo.floatvalue
      paintseed = data.iteminfo.paintseed
    }
  }

  if (paintseed !== null && hasPaintSeedVariant(item.name)) {
    const { success, data } = await csItem.getVariant(session.token, getShortName(item.name), paintseed)

    if (success && data.length > 0) {
      item.$variant = data[0].variant

      const alertId = pushAlert({
        type: alertTypeEnum.INFO,
        title: 'Rare item',
        body: createRareItemAlertBody(item.name, item.$variant, item.$price, item.$discount)
      }, null)

      item.$alerts.push(alertId)
    }
  }

  if (floatvalue > 0 && highRankFloat >= floatvalue) {
    const alertId = pushAlert({
      type: alertTypeEnum.INFO,
      title: 'Rare item',
      body: createRareItemAlertBody(item.name, floatvalue, item.$price, item.$discount)
    }, null)

    item.$alerts.push(alertId)
  }

  item.$owner = S
  item.$inspect_link = inspectLink
  item.$float = floatvalue
  item.$paint_seed = paintseed
}

const destroyItemAlerts = (alerts) => {
  for (const id of alerts) {
    destroyAlert(id)
  }
}

const getVolumeRarity = (volume) => {
  if (isNaN(volume)) {
    return csItemDetailRarityEnum.COMMON
  }

  return volume < 5
    ? csItemDetailRarityEnum.INFREQUENT
    : csItemDetailRarityEnum.COMMON
}

const getDopplerPhaseRarity = (phase) => {
  return rareDopplerPhases.indexOf(phase) > -1
    ? csItemDetailRarityEnum.INFREQUENT
    : csItemDetailRarityEnum.COMMON
}

const getFlaotRarity = (float) => {
  if (isNaN(float)) {
    return csItemDetailRarityEnum.COMMON
  }

  let rarity = csItemDetailRarityEnum.COMMON

  for (const [min, max] of valuableFloatRanges) {
    if (float >= min && float <= max) {
      rarity = csItemDetailRarityEnum.INFREQUENT

      break
    }
  }

  return float <= highRankFloat
    ? csItemDetailRarityEnum.RARE
    : rarity
}

export {
  normalizeItemPrice,
  updateItemDetails,
  getVolumeRarity,
  getDopplerPhaseRarity,
  getFlaotRarity,
  destroyItemAlerts
}
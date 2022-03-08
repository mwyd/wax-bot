import { csItem } from '@/api/conduit'
import { inspectTool } from '@/api/csgo_float'
import { session } from '@/stores/userStore'
import { calculateDiscount, WXB_LOG } from '@/utils'

const dopplerPhases = [
    'Phase 1',
    'Phase 2',
    'Phase 3',
    'Phase 4',
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

const getDopplerPhase = (name) => {
    for(let dopplerPhase of dopplerPhases) {
        if(name.includes(dopplerPhase)) return dopplerPhase
    }

    return null
}

const hasPaintSeedVariant = (hashName) => {
    for(let keyword of paintSeedVariantKeywords) {
        if(hashName.search(keyword) > -1) return true
    }

    return false
}

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

const updateItemDiscount = (item) => {
    item.$price = item.price / 1000
    item.$discount = calculateDiscount(item.price, item.steam_price_number)
}

const updateItemDetails = async (item) => {
    item.$searchable = item.name.toLowerCase()
    item.$phase = getDopplerPhase(item.market_name)
    item.$hash_name = item.$phase ? item.name.replace('(', `${item.$phase} (`) : item.name

    if(!item.inspect_item) return

    let { id, floatvalue, paintseed } = item.inspect_item

    const { S, inspectLink } = decodeInspectId(id)

    if(floatvalue === null) {
        const { success, data } = await inspectTool.itemInfo(inspectLink)

        if(success) {
            floatvalue = data.iteminfo.floatvalue
            paintseed = data.iteminfo.paintseed
        }
    }

    if(paintseed !== null && hasPaintSeedVariant(item.name)) {
        const { success, data } = await csItem.getVariant(session.token, getShortName(item.name), paintseed)

        if(success && data.length > 0) {
            item.$variant = data[0].variant

            WXB_LOG('Rare item found', {
                variant: item.$variant,
                price: item.$price,
                name: item.name
            })
        }
    }

    if(highRankFloat >= item.floatvalue) {
        WXB_LOG('Rare item found', {
            float: floatvalue,
            price: item.$price,
            name: item.name
        })
    }

    item.$owner = S
    item.$inspect_link = inspectLink
    item.$float = floatvalue
    item.$paint_seed = paintseed
}

export {
    updateItemDiscount,
    updateItemDetails
}
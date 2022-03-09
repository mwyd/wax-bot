import { computed } from 'vue'
import { getDopplerPhaseRarity, getSteamVolumeRarity, getFlaotRarity } from '@/resources/csItem'
import csItemDetailRarityEnum from '@/enums/csItemDetailRarityEnum'

export default function useCsItemDetails(item) {
    const details = computed(() => [
        { 
            name: 'Variant', 
            value: item.value.$variant, 
            rarity: csItemDetailRarityEnum.RARE 
        },
        { 
            name: 'Float', 
            value: item.value.$float, 
            rarity: getFlaotRarity(item.value.$float)
        },
        { 
            name: 'Paint seed', 
            value: item.value.$paint_seed, 
            rarity: csItemDetailRarityEnum.COMMON
        },
        { 
            name: 'Phase', 
            value: item.value.$phase,
            rarity: getDopplerPhaseRarity(item.value.$phase)
        },
        { 
            name: 'Suggested price $', 
            value: item.value.$suggested_price, 
            rarity: csItemDetailRarityEnum.COMMON
        },
        { 
            name: 'Steam price $', 
            value: item.value.$steam?.price, 
            rarity: csItemDetailRarityEnum.COMMON
        },
        { 
            name: 'Steam volume', 
            value: item.value.$steam?.volume, 
            rarity: getSteamVolumeRarity(item.value.$steam?.volume)
        }
    ])

    const inspectLink = computed(() => item.value.$inspect_link)

    const steamOwner = computed(() => item.value.$owner)

    const waxOwner = computed(() => item.value.by)

    return {
        details,
        inspectLink,
        steamOwner,
        waxOwner
    }
}
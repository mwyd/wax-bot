import { computed } from 'vue'
import { getDopplerPhaseRarity, getVolumeRarity, getFlaotRarity } from '@/resources/csItem'
import csItemDetailRarityEnum from '@/enums/csItemDetailRarityEnum'

export default function useCsItemDetails(item) {
  const details = computed(() => [
    {
      name: 'Position',
      value: item.position,
      rarity: csItemDetailRarityEnum.COMMON
    },
    {
      name: 'Variant',
      value: item.$variant,
      rarity: csItemDetailRarityEnum.RARE
    },
    {
      name: 'Float',
      value: item.$float || null,
      rarity: getFlaotRarity(item.$float)
    },
    {
      name: 'Paint seed',
      value: item.$paint_seed || null,
      rarity: csItemDetailRarityEnum.COMMON
    },
    {
      name: 'Phase',
      value: item.$phase,
      rarity: getDopplerPhaseRarity(item.$phase)
    },
    {
      name: 'Suggested price $',
      value: item.$suggested_price,
      rarity: csItemDetailRarityEnum.COMMON
    },
    {
      name: 'Steam price $',
      value: item.$steam?.price,
      rarity: csItemDetailRarityEnum.COMMON
    },
    {
      name: 'Steam volume',
      value: item.$steam?.volume,
      rarity: getVolumeRarity(item.$steam?.volume)
    },
    {
      name: 'Buff price $',
      value: item.$buff?.price,
      rarity: csItemDetailRarityEnum.COMMON
    },
    {
      name: 'Buff volume',
      value: item.$buff?.volume,
      rarity: getVolumeRarity(item.$buff?.volume)
    }
  ])

  return {
    details
  }
}
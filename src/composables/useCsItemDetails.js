import { computed } from 'vue'
import { getDopplerPhaseRarity, getVolumeRarity, getFlaotRarity } from '@/resources/csItem'
import csItemDetailRarityEnum from '@/enums/csItemDetailRarityEnum'

export default function useCsItemDetails(item) {
  const details = computed(() => [
    {
      name: 'Position',
      value: item.value.position,
      rarity: csItemDetailRarityEnum.COMMON
    },
    {
      name: 'Variant',
      value: item.value.$variant,
      rarity: csItemDetailRarityEnum.RARE
    },
    {
      name: 'Float',
      value: item.value.$float || null,
      rarity: getFlaotRarity(item.value.$float)
    },
    {
      name: 'Paint seed',
      value: item.value.$paint_seed || null,
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
      rarity: getVolumeRarity(item.value.$steam?.volume)
    },
    {
      name: 'Buff price $',
      value: item.value.$buff?.price,
      rarity: csItemDetailRarityEnum.COMMON
    },
    {
      name: 'Buff volume',
      value: item.value.$buff?.volume,
      rarity: getVolumeRarity(item.value.$buff?.volume)
    }
  ])

  return {
    details
  }
}
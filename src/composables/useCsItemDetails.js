import { computed } from 'vue'

export default function useCsItemDetails(item) {
    const details = computed(() => [
        { name: 'Float', value: item.value.$float },
        { name: 'Paint seed', value: item.value.$paint_seed },
        { name: 'Variant', value: item.value.$variant },
        { name: 'Phase', value: item.value.$phase },
        { name: 'Suggested price $', value: item.value.$price },
        { name: 'Steam price $', value: item.value.$steam?.price },
        { name: 'Steam volume', value: item.value.$steam?.volume }
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
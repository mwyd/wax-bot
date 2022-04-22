<template>
    <div class="wxb-mb-2 wxb-flex">
        <AppInput 
            v-model="filters.search"
            type="text"
            placeholder="Search..."
        />
        <div class="wxb-ml-2 wxb-flex-[0_0_160px]">
            <select
                class="wxb-input"
                v-model="filters.sortBy"
            >
                <option
                    v-for="[key, variant] in Object.entries(sortVariants)"
                    :key="key"
                    :value="key"
                >
                    {{ variant.name }}
                </option>
            </select>
        </div>
        <div 
            :class="sortDirBtnClass"
            @click="filters.sortAsc = !filters.sortAsc"
        >
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script>
import { toRefs, watch, computed } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import useCsItemFilters from '@/composables/useCsItemFilters'

export default {
    components: {
        AppInput
    },
    props: {
        items: {
            type: Array,
            required: true
        },
        defaultFilters: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ['filter'],
    setup(props, { emit }) {
        const { items, defaultFilters } = toRefs(props)

        const { filters, sortVariants, comparator } = useCsItemFilters(defaultFilters.value)

        const sortDirBtnClass = computed(() => [
            'wxb-sort-dir-btn',
            'wxb-cursor-pointer',
            'wxb-p-1.5',
            'wxb-ml-2',
            filters.sortAsc ? 'wxb-sort-dir-btn--asc' : 'wxb-sort-dir-btn--desc'
        ])

        watch([filters, items], () => {
            const filtered = items.value
                .filter(item => item.$searchable.includes(filters.search.toLowerCase()))
                .sort(comparator)

            emit('filter', filtered)
        })

        return {
            filters,
            sortVariants,
            sortDirBtnClass
        }
    }
}
</script>

<style scoped>
.wxb-sort-dir-btn {
    flex: 0 0 30px;
    border-radius: 2px;
    background-color: var(--i-bg-c);
    border: 1px solid var(--i-br-c);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.wxb-sort-dir-btn > div {
    height: 2px;
    background: var(--state-t2);
    border-radius: 2px;
}

.wxb-sort-dir-btn--desc > div:nth-child(1) {
    width: 100%;
}

.wxb-sort-dir-btn--desc > div:nth-child(2) {
    width: 80%;
}

.wxb-sort-dir-btn--desc > div:nth-child(3) {
    width: 60%;
}

.wxb-sort-dir-btn--asc > div:nth-child(1) {
    width: 60%;
}

.wxb-sort-dir-btn--asc > div:nth-child(2) {
    width: 80%;
}

.wxb-sort-dir-btn--asc > div:nth-child(3) {
    width: 100%;
}
</style>

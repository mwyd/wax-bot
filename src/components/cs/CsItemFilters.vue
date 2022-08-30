<template>
  <div class="wxb-flex wxb-mb-3.5">
    <AppInput
      v-model="filters.search"
      type="text"
      placeholder="Search..."
    />
    <div class="wxb-ml-3.5 wxb-flex-lg">
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
import AppInput from '@/components/ui/AppInput'
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
      'wxb-sort-btn',
      'wxb-cursor-pointer',
      'wxb-p-2.5',
      'wxb-ml-3.5',
      filters.sortAsc ? 'wxb-sort-btn-asc' : 'wxb-sort-btn-desc'
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
.wxb-sort-btn {
  flex: 0 0 32px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @apply wxb-bg-gray-800;
  @apply wxb-text-gray-900;
  @apply wxb-border wxb-border-solid wxb-border-gray-900;
}

.wxb-sort-btn > div {
  height: 2px;
  border-radius: 2px;
  @apply wxb-bg-gray-400;
}

.wxb-sort-btn-desc > div:nth-child(1) {
  width: 100%;
}

.wxb-sort-btn-desc > div:nth-child(2) {
  width: 80%;
}

.wxb-sort-btn-desc > div:nth-child(3) {
  width: 60%;
}

.wxb-sort-btn-asc > div:nth-child(1) {
  width: 60%;
}

.wxb-sort-btn-asc > div:nth-child(2) {
  width: 80%;
}

.wxb-sort-btn-asc > div:nth-child(3) {
  width: 100%;
}
</style>

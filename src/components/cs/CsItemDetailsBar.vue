<template>
  <div class="wxb-bg-gray-600 wxb-w-full wxb-p-1.5 wxb-flex wxb-flex-wrap wxb-items-center">
    <CsItemDetail
      v-for="(detail, i) in existingDetails"
      :key="`${detail.name}-${i}`"
      :name="detail.name"
      :value="detail.value"
      :rarity="detail.rarity"
    />
    <a
      :href="buffMarketLink"
      target="_blank"
    >
      <CsItemDetail
        name="Buff"
        value="market"
      />
    </a>
    <a
      v-if="steamOwner"
      :href="'https://steamcommunity.com/profiles/' + steamOwner"
      target="_blank"
    >
      <CsItemDetail
        name="Steam"
        value="owner"
      />
    </a>
    <a
      v-if="waxOwner"
      :href="'https://waxpeer.com/shop/' + waxOwner"
      target="_blank"
    >
      <CsItemDetail
        name="Waxpeer"
        value="owner"
      />
    </a>
    <CsItemDetail
      v-if="inspectLink"
      class="wxb-cursor-pointer"
      name="Inspect"
      value="link"
      @click="copyToClipboard(inspectLink)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { copyToClipboard } from '@/utils'
import CsItemDetail from '@/components/cs/CsItemDetail'

const props = defineProps({
  details: {
    type: Array,
    required: true
  },
  hashName: {
    type: String,
    required: true
  },
  steamOwner: {
    type: String
  },
  waxOwner: {
    type: String
  },
  inspectLink: {
    type: String
  },
  buffGoodId: {
    type: Number
  }
})

const existingDetails = computed(() => props.details.filter(e => e.value != null))

const buffMarketLink = computed(() => props.buffGoodId
  ? 'https://buff.163.com/goods/' + props.buffGoodId
  : 'https://buff.163.com/market/csgo#search=' + props.hashName
)
</script>

<style>

</style>
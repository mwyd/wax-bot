<template>
  <CsItem :item="item">
    <div class="wxb-flex wxb-items-center wxb-flex-sm wxb-px-3.5">
      <AppButton
        class="wxb-btn-big"
        :disabled="buyBtnDisabled"
        @click="buy"
      >
        Buy
      </AppButton>
    </div>
  </CsItem>
</template>

<script setup>
import { ref } from "vue";
import AppButton from "@/components/ui/AppButton";
import CsItem from "@/components/cs/CsItem";
import { buyItem } from "@/stores/botStore";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const buyBtnDisabled = ref(false);

const buy = () => {
  buyBtnDisabled.value = true;

  buyItem(props.item).then(() => (buyBtnDisabled.value = false));
};
</script>

<style></style>

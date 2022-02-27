<template>
    <div :class="appClass">
        <AppHeader 
            :tabs="Object.keys(tabs)"
            :active-tab="activeTab"
            @tabChange="tab => activeTab = tab"
        />
        <KeepAlive>
            <component :is="tabs[activeTab]" />
        </KeepAlive>
        <AppButton
            class="wxb-app__open-btn"
            @click="isHidden = !isHidden"
        >
            {{ isHidden ? '›' : '‹' }}
        </AppButton>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { setupStores } from '@/stores'
import AppHeader from '@/components/AppHeader.vue'
import AppButton from '@/components/ui/AppButton.vue'
import useTabs from '@/composables/useTabs'

export default {
    components: {
        AppHeader,
        AppButton
    },
    setup() {
        setupStores()

        const isHidden = ref(true)

        const appClass = computed(() => [
            'wxb-shadow-md',
            'wxb-app',
            isHidden.value ? 'wxb-app--hidden' : ''
        ])

        return {
            ...useTabs(),
            isHidden,
            appClass
        }
    }
}

</script>

<style>
#wxb-root {
    width: 100vw;
    max-width: 1280px;
    height: 100vh;
    max-height: 720px;
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    z-index: 1000;
    color: white;
    font-family: Montserrat, sans-serif;
}

#wxb-root * {
    box-sizing: border-box;
}

.wxb-app {
    width: 100%;
    height: 100%;
    background-color: var(--bg-c-1);
    position: relative;
    transform: translateX(100%);
    display: flex;
    flex-direction: column;
}

.wxb-app--hidden {
    transform: translateX(0%);
}

.wxb-app__open-btn {
    position: absolute;
    top: 0;
    right: -20px;
    width: 20px;
    height: 70px;
    font-size: 20px;
}
</style>

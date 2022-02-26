<template>
    <div class="wxb-flex wxb-items-center wxb-px-[8px]">   
        <img 
            class="wxb-h-[50px] wxb-pr-[8px]"
            :src="imageUrl" 
        />
        <a 
            href="https://google.com" 
            target="_blank"
        >
            <div>
                {{ hashName }}
            </div>
        </a>
    </div>
</template>

<script>
export default {
    props: {
        hashName: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        }
    }
}
</script>

<style>

</style>
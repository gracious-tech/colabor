
<template lang='pug'>


div.pray
    h3 Pray
    div.quote “Pray for us, that the word of the Lord may spread quickly and be held in honor.” (2 Thes 3:1)

    v-btn(variant='tonal' color='' text="Subscribe to newsletter")
    v-btn(variant='tonal' color='' text="Follow on Facebook")


</template>


<script lang='ts' setup>


</script>


<style lang='sass' scoped>

.pray
    width: 100%
    padding: 24px 24px 36px 24px
    color: rgb(var(--v-theme-on-primary))
    background-color: rgb(var(--v-theme-primary))
    text-align: center

    h3
        font-size: 40px

    .quote
        font-size: 16px
        font-style: italic
        margin-bottom: 48px

    .v-btn
        margin: 12px

</style>

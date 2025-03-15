
<template lang='pug'>

VDialog(v-model='show' persistent max-width='600' class='text-center'
        :fullscreen='$vuetify.display.smAndDown' scrollable)
    VCard.dialog-card
        DialogDonateLogic(@close='show = false' :activity='activity')

</template>


<script lang='ts' setup>

import DialogDonateLogic from './DialogDonateLogic.vue'


const show = defineModel<boolean>({required: true})
defineProps<{activity:string|null}>()


</script>


<style lang='sass' scoped>

// Move buttons and title in when not fullscreen
// WARN Careful to not affect other cards within dialog
.v-dialog:not(.v-dialog--fullscreen) .dialog-card
    & > :deep(.v-card-actions)
        padding: 18px 40px 40px 40px !important
    & > :deep(.v-card-title > div)
        margin-top: 60px !important

// Move buttons up to end of content when fullscreen so user can navigate with fingers near top
// But still pushes buttons down when content fills page
.v-dialog--fullscreen .dialog-card
    & > :deep(.v-card-text)
        height: auto
        flex-grow: 0
    & > :deep(.v-card-actions)
        flex-grow: 1
        align-items: flex-start

</style>

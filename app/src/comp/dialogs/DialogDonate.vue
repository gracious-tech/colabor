
<template lang='pug'>

VDialog(v-model='show' persistent max-width='600' class='text-center'
        :fullscreen='$vuetify.display.smAndDown' scrollable)
    VCard.dialog-card
        DialogDonateLogic(@close='show = false' :activity='activity')

</template>


<script lang='ts' setup>

import {watch} from 'vue'

import DialogDonateLogic from './DialogDonateLogic.vue'


const show = defineModel<boolean>({required: true})
defineProps<{activity:string|null}>()


watch(show, () => {
    if (show.value){
        // Showing dialog so push state
        self.history.pushState({DialogDonate: true}, '')
    } else if ((self.history.state as Record<string, unknown>)['DialogDonate']){
        // Closing dialog so remove state, but not if already removed by back button
        // WARN Otherwise this would result in a double back
        self.history.back()
    }
})

self.addEventListener('popstate', () => {
    // Close dialog whenever going back, regardless of route
    show.value = false
})

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

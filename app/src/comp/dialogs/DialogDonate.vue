
<template lang='pug'>

VDialog(v-model='show' persistent max-width='600' class='text-center'
        :fullscreen='$vuetify.display.smAndDown' scrollable)
    VCard
        DialogDonateLogic(@close='show = false' :activity='activity')

</template>


<script lang='ts' setup>

import DialogDonateLogic from './DialogDonateLogic.vue'


const show = defineModel<boolean>({required: true})
defineProps<{activity:string|null}>()


</script>


<style lang='sass' scoped>


</style>

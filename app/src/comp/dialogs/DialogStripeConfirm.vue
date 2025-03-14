
<template lang='pug'>

VDialog(v-model='show' max-width='600' :fullscreen='$vuetify.display.smAndDown')
    VCard(class='text-center')
        VCardTitle(class='mt-4') Donation received
        VCardText Thanks for your support!
        VCardActions
            VBtn(@click='show = false') Close

</template>


<script lang='ts' setup>

import {ref} from 'vue'

// Auto-show if stripe id detected in hash
const show = ref(self.location.hash.startsWith('#stripe='))


</script>


<style lang='sass' scoped>


</style>

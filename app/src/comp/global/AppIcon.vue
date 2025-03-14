
<template lang='pug'>

component.icon(:is='icons[name]')

</template>


<script lang='ts' setup>


import * as icons_import from '@/services/icons'

import type {FunctionalComponent} from 'vue'


defineProps({
    name: {required: true, type: String},
})

// Don't know why types not inferred, so use new var to recast
const icons = icons_import as unknown as Record<string, FunctionalComponent>


</script>


<style lang='sass' scoped>

.icon
    height: 24px
    width: 24px
    fill: currentColor

</style>

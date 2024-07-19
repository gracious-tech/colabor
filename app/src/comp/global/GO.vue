
<template lang='pug'>

a(:target='target' v-bind='props')
    slot

</template>


<script lang='ts' setup>

import {computed} from 'vue'

const props = defineProps<{href:string}>()

const target = computed(() => {
    return props['href']?.startsWith('http') ? '_blank' : ''
})


</script>

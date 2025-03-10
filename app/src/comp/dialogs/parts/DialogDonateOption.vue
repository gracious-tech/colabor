
<template lang='pug'>

VCard(:title="title")

</template>


<script lang='ts' setup>

const props = defineProps<{title:string, body:string}>()

</script>


<style lang='sass' scoped>

</style>

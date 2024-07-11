
<template lang='pug'>

v-app
    v-main
        RouterView


</template>


<script lang='ts' setup>

import {RouterView} from 'vue-router'

</script>


<style lang='sass' scoped>

.v-application
    max-width: 800px
    margin: 48px auto
    @media (max-width: 860px)
        margin-top: 0
        max-width: none

</style>

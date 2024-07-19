
<template lang='pug'>

div.logo(@click='click' :class='{clickable}')
    div.name COLABOR
    div.motto Fund.Freely.Giving


</template>


<script lang='ts' setup>

import {useRouter} from 'vue-router'


const props = defineProps<{clickable?:boolean}>()

const router = useRouter()

const click = () => {
    if (props.clickable){
        router.push("/")
    }
}



</script>


<style lang='sass' scoped>

.logo
    display: inline-block
    color: white
    text-align: center
    user-select: none

    &.clickable
        cursor: pointer

    .name
        font-size: 60px
        font-weight: 200


</style>

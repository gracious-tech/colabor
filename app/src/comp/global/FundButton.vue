<!-- WARN Don't load fundraiser data as this is used on homepage for examples
    and would slow down first load -->

<template lang='pug'>

div.button(@click='click')
    img(:src='img_url')
    div.text
        h3 {{ name }}
        div {{ subheading }}

</template>


<script lang='ts' setup>

import {computed} from 'vue'
import {useRouter} from 'vue-router'

import {data_url} from '@/services/backend'


const props = defineProps<{id:string, name:string, subheading:string, newtab?:boolean}>()
const router = useRouter()

const img_url = computed(() => {
    return data_url(props.id) + '/profile.jpg'
})

const click = () => {
    if (props.newtab){
        self.open(`/${props.id}`, '_blank')
    } else {
        router.push({name: 'fundraiser', params: {fundraiser: props.id}})
    }
}



</script>


<style lang='sass' scoped>

.button
    display: inline-flex
    user-select: none
    cursor: pointer
    border-radius: 12px
    overflow: hidden
    width: 300px
    height: 100px

    img
        width: 100px
        height: 100px
        object-fit: cover

    .text
        padding: 12px
        background-color: rgb(var(--v-theme-primary))

        h3
            font-size: 16px

        > div
            font-size: 14px


</style>

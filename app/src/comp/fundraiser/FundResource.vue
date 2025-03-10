
<template lang='pug'>

VCard(:href='resource.url' target='_blank')
    img(:src='`${fund.url}/resource-${resource.id}.jpg`')
    VCardText
        h3 {{ resource.title }}
        div {{ resource.desc }}

</template>


<script lang='ts' setup>

import {inject} from 'vue'

import type {Resource, Fundraiser} from '@/types'

const props = defineProps<{resource:Resource}>()
const fund = inject('fund') as Fundraiser


</script>


<style lang='sass' scoped>

img
    width: 100%
    object-fit: cover
    aspect-ratio: 1200 / 630
    display: block

.v-card
    font-size: 16px
    background-color: #333
    color: #fffd

    @media (max-width: 600px)
        font-family: Roboto Condensed, Roboto, sans-serif
        .v-card-text
            padding: 12px

    h3
        margin-bottom: 6px

</style>


<template lang='pug'>

div.activity
    img(:src='`${fund.url}/activity${activity.id}.jpg`')
    div
        h3 {{ activity.title }}
        div(v-html='activity.desc')


</template>


<script lang='ts' setup>

import {inject} from 'vue'

import type {Fundraiser} from '@/types'


const props = defineProps<{activity:unknown}>()
const fund = inject('fund') as Fundraiser


</script>


<style lang='sass' scoped>

.activity
    display: flex
    overflow: hidden
    width: 100%
    border: 2px dashed transparent
    border-radius: 12px
    margin-bottom: 24px
    font-size: 15px
    cursor: pointer

    &.selected
        border-color: rgb(var(--v-theme-secondary))
        border-style: solid

    &:hover
        border-color: rgb(var(--v-theme-secondary))

    img
        width: 30%
        aspect-ratio: 10 / 1  // Really different just so height set by text and not image
        object-fit: cover

    & > div
        padding: calc(var(--gutter) / 2)
        background-color: #eee

        p
            margin-top: 0


</style>
